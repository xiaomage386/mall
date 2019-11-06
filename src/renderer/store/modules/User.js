const state = {
	isLogin: false,
	Profile: {}
}

const getters = {
	isLogin: state => {
		return state.isLogin
	},
	Profile: state => {
		return state.Profile
	}
}

const mutations = {
	setLogin(state, isLogin) {
		state.isLogin = isLogin;
	},
	setProfile(state, data){
		state.Profile = data
	}
}

const actions = {
	AUTH_CHANGE({commit}, isLogin) {
		commit('setLogin', !!isLogin);
	},
	CHANGE_PROFILE({commit}, data) {
		commit('setProfile', data || {});
	}
}

export default {
	state,
	getters,
	mutations,
	actions
}
