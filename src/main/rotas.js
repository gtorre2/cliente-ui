import React from 'react'

import Login from '../views/login'
import Home from '../views/home'
import CadastroClientes from '../views/clientes/cadastro-clientes';
import ConsultaClientes from '../views/clientes/consulta-clientes';
import VisualizarClientes from '../views/clientes/visualizar-clientes'

import { AuthConsumer } from '../main/provedorAutenticacao'

import { Route, Switch, HashRouter, Redirect } from 'react-router-dom'


function RotaAutenticada( { component: Component, isUsuarioAutenticado, ...props } ){
    return (
        <Route {...props} render={ (componentProps) => {
            if(isUsuarioAutenticado){
                return (
                    <Component {...componentProps} />
                )
            }else{
                return(
                    <Redirect to={ {pathname : '/login', state : { from: componentProps.location } } } />
                )
            }
        }}  />
    )
}

function Rotas(props){
    return (
        <HashRouter>
            <Switch>
                <Route path="/login" component={Login} />
                
                <RotaAutenticada isUsuarioAutenticado={props.isUsuarioAutenticado} path="/home" component={Home} />
                
                <RotaAutenticada isUsuarioAutenticado={props.isUsuarioAutenticado} path="/consulta-clientes" component={ConsultaClientes} />
                <RotaAutenticada isUsuarioAutenticado={props.isUsuarioAutenticado} path="/cadastro-clientes/:id?" component={CadastroClientes} />
                <RotaAutenticada isUsuarioAutenticado={props.isUsuarioAutenticado} path="/visualizar-clientes/:id?" component={VisualizarClientes} />

            </Switch>
        </HashRouter>
    )
}

export default () => (
    <AuthConsumer>
        { (context) => (<Rotas isUsuarioAutenticado={context.isAutenticado} />) }
    </AuthConsumer>
)