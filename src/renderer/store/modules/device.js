const state = {
    isConnect: false,
    isBackup: false
}

const getters = {
    isConnect: state => {
        return state.isConnect
    },
    isBackup: state => {
        return state.isBackup
    }
}

const mutations = {
    setConnect(state, isConnect) {
        state.isConnect = isConnect;
    },
    setBackup(state, isBackup) {
        state.isBackup = isBackup;
    }
}

const actions = {
    CONNECT_CHANGE({ commit }, isConnect) {
        commit('setConnect', isConnect);
    },
    BACKUP_CHANGE({ commit }, isBackup) {
        commit('setBackup', isBackup);
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}
