import React from 'react'

import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import SelectMenu from '../../components/selectMenu'
import InputMask from "react-input-mask";

import { withRouter } from 'react-router-dom'
import * as messages from '../../components/toastr'

import ClienteService from '../../app/service/clienteService'

class VisualizarClientes extends React.Component {

    state = {
        id: null,
        nome: '',
        email: '',
        cpf: '',
        tipo: '',
        cep: '',
        logradouro: '',
        bairro: '',
        cidade: '',
        uf: '',
        numeroTelefone: '',
        usuario: null,
        atualizando: false
    }

    constructor(){
        console.log('passou aqui');
        super();
        this.service = new ClienteService();
    }

    componentDidMount(){
        const params = this.props.match.params
       
        if(params.id){
            this.service.obterPorId(params.id)
                .then(response => {
                    this.setState( {...response.data, atualizando: true} )
                })
                .catch(erros => {
                    messages.mensagemErro(erros.response.data)
                })
        }
    }

    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({ [name] : value })
    }

    render(){
        const tipos = this.service.obterListaTiposTelefone();
        
        return (
            <Card title={ 'Vizualização de Clientes' }>
                <div className="row">
                    <div className="col-md-12">
                        <FormGroup id="inputNome" label="Nome: *" >
                            <input id="inputNome" type="text" 
                                   className="form-control" 
                                   name="nome"
                                   value={this.state.nome}
                                   onChange={this.handleChange}  
                                   disabled/>
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <FormGroup id="inputEmail" label="Email: *" >
                            <input id="inputEmail" type="text" 
                                   className="form-control" 
                                   name="email"
                                   value={this.state.email}
                                   onChange={this.handleChange}  
                                   disabled/>
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <FormGroup id="inputCPF" label="CPF: *" >
                            <InputMask id="inputCPF"
                                   className="form-control" 
                                   name="cpf"
                                   mask="99.999.999-99"
                                   value={this.state.cpf}
                                   onChange={this.handleChange}  
                                   disabled/>
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-5">
                        <FormGroup id="inputCep" label="CEP: *" >
                            <InputMask id="inputCep"
                                   className="form-control" 
                                   name="cep"
                                   mask="99999-999"
                                   value={this.state.cep}
                                   onChange={this.handleChange}
                                   disabled />
                        </FormGroup>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <FormGroup id="inputLogradouro" label="Logradouro:" >
                            <input type="text" id="inputLogradouro"
                                   className="form-control" 
                                   name="logradouro"
                                   value={this.state.logradouro}
                                   onChange={this.handleChange}  
                                   disabled />
                        </FormGroup>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <FormGroup id="inputBairro" label="Bairro:" >
                            <input type="text" id="inputBairro"
                                   className="form-control" 
                                   name="bairro"
                                   value={this.state.bairro}
                                   onChange={this.handleChange}  
                                   disabled />
                        </FormGroup>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <FormGroup id="inputCidade" label="Cidade:" >
                            <input type="text" id="inputCidade"
                                   className="form-control" 
                                   name="cidade"
                                   value={this.state.cidade}
                                   onChange={this.handleChange}  
                                   disabled />
                        </FormGroup>
                    </div>

                    <div className="col-md-6">
                        <FormGroup id="inputUf" label="UF:" >
                            <input type="text" id="inputUf"
                                   className="form-control" 
                                   name="uf"
                                   value={this.state.uf}
                                   onChange={this.handleChange}  
                                   disabled/>
                        </FormGroup>
                    </div>
                </div>

                
                <div className="row">
                    <div className="col-md-4">
                         <FormGroup id="inputTipo" label="Tipo: *">
                            <SelectMenu id="inputTipo" 
                                        lista={tipos} 
                                        name="tipo"
                                        value={this.state.tipo}
                                        onChange={this.handleChange}
                                        className="form-control" 
                                        disabled/>
                        </FormGroup>
                    </div>    
                    
                    <div className="col-md-4">
                        <FormGroup id="inputNumero" label="Número:" >
                            <input type="number" id="inputNumero"
                                   className="form-control" 
                                   name="numeroTelefone"
                                   value={this.state.numeroTelefone}
                                   onChange={this.handleChange}  
                                   disabled/>
                        </FormGroup>
                    </div>
                </div>

                <div className="row">
                     <div className="col-md-6" >
                        <button onClick={e => this.props.history.push('/consulta-clientes')} 
                                className="btn btn-danger">
                                <i className="pi pi-times"></i>Cancelar
                        </button>
                    </div>
                </div>
            </Card>
        )
    }
}

export default withRouter(VisualizarClientes);