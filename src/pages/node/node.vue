<template>
  <div class="node" v-loading="!selectedNode">
    <!-- 无人机、机场 页面 -->
    <component v-if="selectedNode" :is="componentName" :node="selectedNode"></component>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import Depot from '@/components/depot/depot.vue';
import Drone from '@/components/drone/drone.vue';

const ComponentName = {
  'air': Drone.name,
  'depot': Depot.name
};

export default {
  name: 'sd-node',
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapState([
      'node'
    ]),
    selectedNode() {
      return this.node.find(node => node.info.id === this.id);
    },
    componentName() {
      return ComponentName[this.selectedNode.info.type_name];
    }
  },
  components: {
    [Depot.name]: Depot,
    [Drone.name]: Drone
  }
};
</script>
