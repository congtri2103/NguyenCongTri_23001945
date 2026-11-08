<script>
const paths = {
  box: ['m21 8-9 5-9-5', 'M12 13v9', 'm16.5 5.5-9 5', 'm12 2 9 5v10l-9 5-9-5V7l9-5Z'],
  grid: ['M3 3h7v7H3z', 'M14 3h7v7h-7z', 'M3 14h7v7H3z', 'M14 14h7v7h-7z'],
  search: ['M21 21l-4.5-4.5', 'M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0'],
  plus: ['M12 5v14', 'M5 12h14'],
  trash: ['M3 6h18', 'M9 6V3h6v3', 'M5 6l1 15h12l1-15', 'M10 10v7', 'M14 10v7'],
  arrow: ['M7 7h14', 'M7 12h10', 'M7 17h6', 'M3 4v16', 'm1 18 2 2 2-2'],
  wallet: ['M20 8V5a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h16v12H5a3 3 0 0 1-3-3V6', 'M21 12h-5v5h5'],
  layers: ['m12 3 10 5-10 5L2 8l10-5Z', 'm2 12 10 5 10-5', 'm2 16 10 5 10-5'],
  check: ['m5 12 4 4L19 6'],
  info: ['M12 11v6', 'M12 7h.01', 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0'],
  close: ['m6 6 12 12', 'M6 18 18 6'],
  chevron: ['m6 9 6 6 6-6'],
  monitor: ['M3 3h18v13H3z', 'M12 16v5', 'M8 21h8'],
  pen: ['m16 3 5 5L8 21H3v-5L16 3Z', 'm13 6 5 5'],
  home: ['m3 10 9-7 9 7', 'M5 9v12h14V9', 'M9 21v-8h6v8'],
  reset: ['M3 11a9 9 0 1 1 2.6 7', 'M3 4v7h7'],
}

export default {
  props: { name: { type: String, required: true } },
  computed: { paths() { return paths[this.name] || paths.box } },
}
</script>

<template>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path v-for="(path, index) in paths" :key="index" :d="path" />
  </svg>
</template>
