//importar la dependecia de vue
import Vue from 'vue'

//importar la dependecia de Vuex
import Vuex from 'vuex'
import axios from 'axios'
import buffer from 'buffer'

Vue.use(Vuex)

console.log("process.env.NODE_ENV " + process.env.NODE_ENV)

const url = (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:1026') + ''
const url_auth = (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000') + ''

export default new Vuex.Store({
    state: {
        usuarios: [],
        deas: [],
        usuario: '',
        dea: '',
        deasActivos: [],
    },

    getters: {
        deas: state => state.deas
    },

    actions: {

        //APIS USUARIOS//

        async getUsuarios({ commit }) {
            try {
                const usuarios = await axios.get(url + "/v2/entities?type=user")
                commit('GET_Usuarios', usuarios.data)
                return usuarios.data
            }
            catch (error) {
                return null
            }
        },

        async agregarUsuario({ commit }, usuarioNuevo) {
            try {
                const { data: usuario } = await axios.post(url + "/v2/entities",
                    usuarioNuevo,
                    { 'Content-Type': 'application/json' })
                commit('POST_Usuario', usuario)
                return true
            }
            catch (error) {
                return false
            }
        },

        async actualizarUsuario({commit}, data) {
           try {
                const {data: usuario} = await axios.patch(url + "/v2/entities/" + data.id +
                    "/attrs?type=user", data.body, { 'content-type': 'application/json' })
                commit('PATCH_Usuario', usuario)
                return true
            }
            catch (error) {
                return false
            }
        },

        async loguearAdmin({ commit }, credenciales) {
            try {
                const params = new URLSearchParams()
                params.append("username", credenciales.name)
                params.append("password", credenciales.password)
                params.append("grant_type", "password")

                const usuario = await axios.post(url_auth + "/oauth2/token", params,
                    {
                        headers: {
                            'content-type': 'application/x-www-form-urlencoded',
                            'Authorization': 'Basic ' + buffer.Buffer.from(process.env.VUE_APP_ID_CLIENT + ':' +
                                process.env.VUE_APP_ID_SECRET).toString('base64')
                        }
                    })
                commit('Login', usuario)
                return true
            }
            catch (error) {
                return false
            }
        },

        async subscriber() {
            try {
                let body = {
                    "subject": {
                        "entities": [
                            {
                                "idPattern": ".*"
                            }
                        ]
                    },
                    "notification": {
                        "http": {
                            "url": "http://cygnus:5055/notify"
                        },
                        "attrsFormat": "legacy"
                    }
                }

                let persistencia = await axios.post(url + "/v2/subscriptions/", body,
                    { 'content-type': 'application/json' })
                console.log(persistencia)
                return true
            }
            catch (error) {
                return false
            }
        },

        async getSubscriptions() {
            try {
                let subscriptions = await axios.get(url + "/v2/subscriptions/",
                    { 'content-type': 'application/json' })
                return subscriptions.data.length
            }
            catch (error) {
                return -1
            }
        },

        async getUsuarioByMail({ commit }, mail) {
            try {
                const usuario = await axios.get(url + "/v2/entities/" + mail + "?type=user")
                commit('GET_USUARIO', usuario.data)
                return usuario.data
            }
            catch (error) {
                return null
            }
        },

        //APIS DEAS//

        async getDeas({ commit }) {
            try {
                const { data: deas } = await axios.get(url + "/v2/entities?type=dea")
                commit('GET_Deas', deas)
                return true
            }
            catch (error) {
                return false
            }
        },

        async agregarDea({ commit }, deaNuevo) {
            try {
                const { data: dea } = await axios.post(url + "/v2/entities", deaNuevo, { 'content-type': 'application/json' })
                commit('POST_Dea', dea)
                return true
            }
            catch (error) {
                return false
            }
        },

        async actualizarDea({ commit }, deaAModificar) {
            let body = {
                address: { type: "String", value: deaAModificar.address.value },
                latitude: { type: "String", value: deaAModificar.latitude.value },
                longitude: { type: "String", value: deaAModificar.longitude.value },
                active: { type: "Boolean", value: deaAModificar.active.value }
            }

            try {
                const { data: dea } = await axios.patch(url + "/v2/entities/" + deaAModificar.id +
                    "/attrs?type=dea", body, { 'content-type': 'application/json' })
                commit('PATCH_Dea', dea)
                return true
            }
            catch (error) {
                return false
            }
        },

        async getDeaById({ commit }, id) {
            try {
                const { data: dea } = await axios.get(url + "/v2/entities/" + id + "?type=dea")
                commit('GET_Dea', dea)
                return true
            }
            catch (error) {
                return false
            }
        },
    },

    mutations: {

        Login(state, usuario) {
            localStorage.setItem('access_token', usuario.data['access_token'])
        },

        //USUARIOS//

        GET_Usuarios(state, data) {
            state.usuarios = data
        },

        POST_Usuario(state, data) {
            state.usuarios.push(data)
        },

        PATCH_Usuario(state, data) {
            let index = state.usuarios.findIndex(usuario => usuario.id == data.id)
            state.usuarios.splice(index, 1, data)
            state.usuario = data
        },

        GET_USUARIO(state, data) {
            state.usuario = data
        },

        PUT_results(state, data) {
            state.usuario.results = data
        },


        //DEAS//

        GET_Deas(state, data) {
            state.deas = data          
            let activos = []
            data.forEach((dea) => {
                if (dea.active.value) {
                    activos.push(dea)                    
                }
            });  
            state.deasActivos = activos         
        },
      

        POST_Dea(state, data) {
            state.deas.push(data)
           
        },

        GET_Dea(state, data) {
            state.dea = data
        },

        PATCH_Dea(state, data) {
            let index = state.deas.findIndex(dea => dea.id == data.id)
            state.deas.splice(index, 1, data)
            state.dea = data
        }
    }

})