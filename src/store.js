//importar la dependecia de vue
import Vue from 'vue'

//importar la dependecia de Vuex
import Vuex from 'vuex'

Vue.use(Vuex)

import axios from 'axios'

console.log("process.env.NODE_ENV " + process.env.NODE_ENV)

//const url = (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8080') + '' // desarrollo + producción

const url = (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:1026') + '' // desarrollo + producción

/* 
const url = 'https://627bf2b3b54fe6ee00919ac6.mockapi.io/usuario/'

const url = 'http://localhost:8080/usuarios/' */



export default new Vuex.Store({
    state: {
        usuarios: [],
        deas: [],
        usuario: '',
        dea: '',       
    },

    getters: {
        cursos: state => state.deas
    },

    actions: {
        //APIS USUARIOS//
        async getUsuarios({ commit }) {
            try {
                const usuarios = await axios.get(url + "/v2/entities")
                commit('GET_Usuarios', usuarios.data)                
            }
            catch (error) {
                alert(error)
            }
        },

        async eliminarUsuario({ commit }, id) {
            try {
                await axios.delete(url + "/v2/entities/" + id)
                commit('DELETE_Usuario', id)
                return true
            }
            catch (error) {
                alert(error)
            }
        },

        async agregarUsuario({ commit }, usuarioNuevo) {
            try {
                console.log(usuarioNuevo)
                const { data: usuario } = await axios.post(url + "/v2/entities",
                 usuarioNuevo, 
                 { 'Content-Type': 'application/json' })
                commit('POST_Usuario', usuario)
                return true

            }
            catch (error) {
                //alert(error)                
                return false
            }
        },

        // CAMI PODES HACER ESTE?
        async actualizarUsuario({ commit }, usuarioAModificar) {

            try {
                const { data: usuario } = await axios.put(url + "/api/usuarios/" + usuarioAModificar.mail,
                    usuarioAModificar,
                    { 'content-type': 'application/json' }
                )
                commit('PUT_Usuario', usuario)
                return true
            }
            catch (error) {
                alert(error)
                return false
            }
        },

        // CAMI PODES HACER ESTE?
        async buscarUsuarioPorId({ commit }, id) {
            try {
                const { data: usuario } = await axios.get(url + "/api/usuarios/consultarUsuario/" + id)
                commit('SET_USUARIO', usuario)
            }
            catch (error) {
                alert(error)
            }
        },

        async loguearUsuario({ commit }, credenciales) {
            try {
                const { data: usuario } = await axios.post(url + "/api/usuarios/login", credenciales, { 'content-type': 'application/json' })
                commit('SET_USUARIO', usuario)
                return true
            }
            catch (error) {
                return false
            }
        },

        async loguearAdmin({ commit }, credenciales) {
            try {
                const { data: usuario } = await axios.post(url + "/api/usuarios/loginAdmin", credenciales, { 'content-type': 'application/json' })
                commit('SET_USUARIO', usuario)
                return true
            }
            catch (error) {
                return false
            }
        },

        async buscarUsuarioPorMail({ commit }, mail) {
            try {
                const { data: usuario } = await axios.get(url + "/api/usuarios/consultarUsuarioPorMail/" + mail)
                commit('SET_USUARIO', usuario)
            }
            catch (error) {
                alert(error)
            }
        },

        async inscribirACurso({ commit }, datos) {
            const body = {
                //VER ESTE
                examen_id: datos.examen_id,
                payment: datos.payment,
                number: datos.number
            }
            try {
                const { data: usuario } = await axios.put(url + "/api/usuarios/agregarCursoAlumno/" + datos.idUsuario,
                    body,
                    { 'content-type': 'application/json' }
                )
                commit('PUT_Usuario', usuario)
            }
            catch (error) {
                alert(error)
            }
        },

        async borrarCursoAlumno({ commit }, data) {

            try {
                const { data: results } = await axios.delete(url + "/api/usuarios/borrarCursoAlumno/" + data.usuario,
                    {
                        headers: { 'content-type': 'application/json' },
                        data: { data: data.curso }
                    })
                commit('PUT_results', results)

            }
            catch (error) {
                alert(error)
            }
        },

        //APIS DEAS//
        // CAMI PODES HACER ESTE?
        // GET DEAS
        
        async getDeas({ commit }) {
            try {
                const { data: curso } = await axios.get(url + "/v2/entities")
                commit('GET_Deas', curso)
            }
            catch (error) {
                alert(error)
            }
        },
        // CAMI PODES HACER ESTE?
        async agregarDea({ commit }, deaNuevo) {
            try {
                const { data: dea } = await axios.post(url + "/v2/entities", deaNuevo, { 'content-type': 'application/json' })
                commit('POST_Dea', dea)
                return true
            }
            catch (error) {
                //alert(error)

                return false
            }
        },

        async buscarCurso({ commit }, id) {
            try {
                const { data: curso } = await axios.get(url + "/api/deas/buscarCurso/" + id)
                commit('BUSCAR_Curso', curso)
            }
            catch (error) {
                alert(error)
            }
        },

        async actualizarCurso({ commit }, cursoAModificar) {

            try {
                const { data: curso } = await axios.put(url + "/api/deas/" + cursoAModificar.id,
                    cursoAModificar,
                    { 'content-type': 'application/json' }                    
                )
                commit('PUT_Curso', curso)
                return true
            }
            catch (error) {
                alert(error)
                return false
            }
        },


        async borrarCurso({ commit }, id) {
            try {
                const {data: curso} = await axios.delete(url + "/api/deas/" + id)
                commit('DELETE_Curso', curso)
                return true
            }
            catch (error) {
                alert(error)
            }
        },

    },
    
    mutations: {

        //USUARIOS//
        GET_Usuarios(state, data) {
            state.usuarios = data          
        },

        DELETE_Usuario(state, id) {
            let index = state.usuarios.findIndex(usuario => usuario.id == id)
            state.usuarios.splice(index, 1)
        },

        POST_Usuario(state, data) {
            state.usuarios.push(data)
        },

        PUT_Usuario(state, data) {
            let index = state.usuarios.findIndex(usuario => usuario.id == data.id)
            state.usuarios.splice(index, 1, data)
            state.usuario = data
        },

        SET_USUARIO(state, data) {
            state.usuario = data
        },

        PUT_results(state, data) {
            state.usuario.results = data
        },

        //DEAS//
        GET_Deas(state, data) {
            state.deas = data
        },

        POST_Dea(state, data) {
            state.deas.push(data)
        },

        BUSCAR_Curso(state, data) {
            state.deas = data
        },

        PUT_Curso(state, data) {
            let index = state.deas.findIndex(curso => curso.id == data.id)
            state.deas.splice(index, 1, data)
            state.dea = data
        },

        DELETE_Curso(state, data) {
            let index = state.deas.findIndex(curso => curso.id == data.id)
            if (index == -1) throw new Error('curso no encontrado')
            state.deas.splice(index, 1)
        },
    }

})