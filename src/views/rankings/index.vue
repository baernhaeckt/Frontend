<template>
  <div class="rankings-page">
    <block-box>
      <h1>Ranglisten</h1>
      <div v-if="!isLoaded" class="loader text-center">
        <b-spinner class="large-spinner text-success" />
      </div>
      <template v-else>
        <b-button-group size="lg" class="mt-3 mb-4 switch-buttons">
            <b-button variant="success" @click="setModeToGlobal" :disabled="currentMode === 'global'">Global</b-button>
            <b-button variant="success" @click="setModeToLocal" :disabled="currentMode === 'local'">Local</b-button>
            <b-button variant="success" @click="setModeToFriends" :disabled="currentMode === 'friends'">Friends</b-button>
        </b-button-group>
        <b-table striped hover :items="rankingTableData" :fields="tableFields" v-if="isLoaded && !error" />
        <div class="alert alert-danger" v-if="error">
          Leider ist ein Fehler aufgetreten:<br />{{ error }}
        </div>
      </template>
    </block-box>
  </div>
</template>

<script>
import { RANKINGS_LIST_GENERIC, RANKINGS_LIST_LOCAL } from '@/store/actions/rankings'
import { mapGetters } from 'vuex'

export default {
  name: 'Rankings',
  mounted () {
    this.loadSelected()
  },
  data () {
    return {
      currentMode: 'global',
      isLoaded: false,
      tableFields: [
        { key: 'displayName', sortable: false, label: 'Ökoheld' },
        { key: 'points', sortable: false, label: 'Punkte' }
      ],
      error: undefined
    }
  },
  computed: {
    ...mapGetters(['getLocal', 'getGlobal', 'getFriends', 'getProfile']),
    rankingTableData () {
      switch (this.currentMode) {
        case 'local':
          return this.getLocal
        case 'friends':
          return this.getFriends
        default:
          return this.getGlobal
      }
    },
    memberZip () {
      return this.getProfile.postalCode
    }
  },
  watch: {},
  methods: {
    setModeToLocal () {
      this.currentMode = 'local'
      this.loadSelected()
    },
    setModeToGlobal () {
      this.currentMode = 'global'
      this.loadSelected()
    },
    setModeToFriends () {
      this.currentMode = 'friends'
      this.loadSelected()
    },
    loadSelected () {
      this.isLoaded = false
      this.error = undefined
      var action = this.currentMode === 'local' ? RANKINGS_LIST_LOCAL : RANKINGS_LIST_GENERIC
      var parameter = this.currentMode === 'local' ? this.memberZip : this.currentMode
      this.$store
        .dispatch(action, parameter)
        .then(() => {
          this.isLoaded = true
        })
        .catch(error => {
          this.isLoaded = true
          this.error = error.message
        })
    }
  }
}
</script>

<style lang="scss">
.rankings-page {
  .loader {
    margin: 50px 0;

    .large-spinner {
      width: 4rem;
      height: 4rem;
    }
  }

  .switch-buttons {
    width: 100%;
  }
}
</style>
