const state = {
    menuIndex: 1
}

const getters = {
    menuIndex: state => {
        return state.menuIndex
    }
}

const mutations = {
    setMenuIndex(state, menuIndex) {
        state.menuIndex = menuIndex;
    }
}

const actions = {
    MENU_CHANGE({ commit }, menuIndex) {
        commit('setMenuIndex', menuIndex);
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}
