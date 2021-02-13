import React from 'react'

import UsuarioService from '../app/service/usuarioService'
import { AuthContext } from '../main/provedorAutenticacao'

class Home extends React.Component{

    constructor(){
        super()
        this.usuarioService = new UsuarioService();
    }

    componentDidMount(){
        const usuarioLogado = this.context.usuarioAutenticado;
    }

    render(){
        return (
            <div className="jumbotron">
                <h1 className="display-3">Bem vindo!</h1>
                <hr className="my-4" />
            </div>
        )
    }
}

Home.contextType = AuthContext;

export default Home