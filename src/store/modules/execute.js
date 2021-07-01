// @ts-check

/**
 * @type {SDWC.EXECUTE}
 */
const state = {
  executeTime: ''
};

export const MutationTypes = {
  SET_EXECUTE: 'SET_EXECUTE'
};

/**
 * 
 */
const mutations = {
  [MutationTypes.SET_EXECUTE](state,  payload) {
    // Object.assign(state, payload);
    state.executeTime = payload
  }
};

export default {
  state,
  mutations
};
