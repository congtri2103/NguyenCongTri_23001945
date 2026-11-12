"""Kiểm thử API đang chạy; chỉ xóa những sản phẩm do chính lần kiểm thử tạo ra."""

import json
import os
import uuid
from urllib.error import HTTPError
from urllib.request import Request, urlopen


API_URL = os.environ.get("API_URL", "http://127.0.0.1:8000/api/products.php")
created_ids = set()
checks = 0


def request(method="GET", payload=None, query="", raw=None):
    body = raw if raw is not None else (
        json.dumps(payload, ensure_ascii=False).encode() if payload is not None else None
    )
    req = Request(API_URL + query, data=body, method=method, headers={
        "Content-Type": "application/json", "Accept": "application/json",
    })
    try:
        response = urlopen(req, timeout=10)
    except HTTPError as error:
        response = error
    with response:
        assert response.headers.get_content_type() == "application/json"
        result = json.load(response)
        assert isinstance(result.get("success"), bool), result
        return response.status, result


def expect(status, method="GET", payload=None, query="", raw=None):
    global checks
    actual, result = request(method, payload, query, raw)
    assert actual == status, (method, query, actual, result)
    assert result["success"] == (status < 400), result
    if status >= 400:
        assert isinstance(result.get("message"), str) and result["message"], result
    if method == "POST" and status == 201:
        created_ids.add(result["data"]["id"])
    checks += 1
    return result


def products():
    result = expect(200)
    assert isinstance(result["data"], list)
    for product in result["data"]:
        assert isinstance(product["id"], int), product
        assert isinstance(product["price"], int), product
        assert isinstance(product["stock"], int), product
    return result["data"]


def main():
    initial = products()
    marker = "Kiểm thử " + uuid.uuid4().hex[:10]
    valid = {"name": "  " + marker + "  ", "price": 6000, "stock": 10}
    created = expect(201, "POST", valid)["data"]
    product_id = created["id"]
    query = "?id=" + str(product_id)
    assert created["name"] == marker
    assert created in products(), "Dữ liệu thêm chưa được lưu qua yêu cầu GET mới"
    print("PASS: thêm sản phẩm, bỏ khoảng trắng và đọc lại dữ liệu đã lưu")

    updated = {"name": marker, "price": 7000, "stock": 0}
    expect(200, "PUT", updated, query)
    assert next(p for p in products() if p["id"] == product_id) == {
        "id": product_id, **updated,
    }
    expect(200, "PUT", updated, query)
    print("PASS: sửa giá, chấp nhận tồn bằng 0 và lưu lại dữ liệu không đổi")

    count_before = len(products())
    invalid_products = [
        {"name": marker, "price": 5000, "stock": -1},
        {"name": " \t\n ", "price": 5000, "stock": 1},
        {"name": "\u00a0\u3000", "price": 5000, "stock": 1},
        {"name": "ộ" * 101, "price": 5000, "stock": 1},
        {"name": None, "price": 5000, "stock": 1},
        {"name": 123, "price": 5000, "stock": 1},
        {"name": marker, "price": 0, "stock": 1},
        {"name": marker, "price": -1, "stock": 1},
        {"name": marker, "price": 1.5, "stock": 1},
        {"name": marker, "price": "5000", "stock": 1},
        {"name": marker, "price": True, "stock": 1},
        {"name": marker, "price": 2147483648, "stock": 1},
        {"name": marker, "price": 5000, "stock": 1.5},
        {"name": marker, "price": 5000, "stock": "1"},
        {"name": marker, "price": 5000, "stock": False},
        {"name": marker, "price": 5000, "stock": 2147483648},
        {"name": marker, "price": 5000},
        {},
    ]
    for payload in invalid_products:
        expect(422, "POST", payload)
        expect(422, "PUT", payload, query)
    assert len(products()) == count_before, "Dữ liệu sai đã tạo bản ghi mới"
    assert next(p for p in products() if p["id"] == product_id)["price"] == 7000
    print("PASS: dữ liệu sai bị chặn ở POST/PUT, số bản ghi và dữ liệu cũ không đổi")

    hundred_chars = expect(201, "POST", {"name": "  " + "ộ" * 100 + "  ", "price": 1, "stock": 0})["data"]
    assert len(hundred_chars["name"]) == 100
    special_name = marker + " '); DROP TABLE products; --"
    special = expect(201, "POST", {"name": special_name, "price": 2147483647, "stock": 2147483647})["data"]
    assert special in products()
    print("PASS: tên Unicode 100 ký tự, giới hạn INT và tên chứa dấu nháy")

    for raw in [b"{", b"null", b"[]", b"123", b""]:
        expect(400, "POST", raw=raw)
    for invalid_id in ["", "0", "-1", "abc", "1.5", "2147483648", "1%20OR%201=1", "1&id[]=2"]:
        expect(400, "PUT", updated, "?id=" + invalid_id)
        expect(400, "DELETE", query="?id=" + invalid_id)
    expect(400, "PUT", updated)
    expect(400, "DELETE")
    expect(405, "PATCH", updated)
    absent_id = max(p["id"] for p in products()) + 1
    expect(404, "PUT", updated, "?id=" + str(absent_id))
    expect(404, "DELETE", query="?id=" + str(absent_id))
    print("PASS: JSON sai, mã sai, thiếu mã, phương thức sai và mã không tồn tại")

    expect(200, "DELETE", query=query)
    created_ids.remove(product_id)
    assert all(p["id"] != product_id for p in products())
    expect(404, "DELETE", query=query)
    print("PASS: xóa sản phẩm và xác nhận không còn qua yêu cầu GET mới")

    for cleanup_id in list(created_ids):
        expect(200, "DELETE", query="?id=" + str(cleanup_id))
        created_ids.remove(cleanup_id)
    assert products() == initial, "Dữ liệu ban đầu đã thay đổi sau kiểm thử"
    print(f"Hoàn tất {checks} lượt kiểm tra HTTP; đã dọn dữ liệu kiểm thử.")


if __name__ == "__main__":
    try:
        main()
    finally:
        for cleanup_id in list(created_ids):
            request("DELETE", query="?id=" + str(cleanup_id))
