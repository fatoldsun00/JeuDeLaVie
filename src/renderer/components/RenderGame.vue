<template>
  <div id="wrapper">
    <table>
      <tr
        v-for="(Line,kLine) in arrGame"
        :key="kLine"
      >
        <td
          v-for="(column,kColumn) in arrGame[kLine]"
          :key="kLine+'-'+kColumn"
          :class="arrGame[kLine][kColumn]?'alive':''"
          @click="$electron.ipcRenderer.send ('setAlive',[kLine,kColumn])"
        />
      </tr>
    </table>
  </div>
</template>

<style scoped>
  td {
    background: green;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  td.alive {
    background: #000;
  }
</style>
<script>

export default {
  name: 'RenderGame',
  components: {},
  props: {
    arrGame: {
      type: Array,
      default: () => [],
    },
  },
  methods: {

  },
}
</script>
