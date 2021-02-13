import React from 'react'

import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import SelectMenu from '../../components/selectMenu'
import InputMask from "react-input-mask";

import { withRouter } from 'react-router-dom'
import * as messages from '../../components/toastr'

import ClienteService from '../../app/service/clienteService'
import LocalStorageService from '../../app/service/localstorageService'

class CadastroClientes extends React.Component {

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
        super();
        this.service = new ClienteService();
    }

    url = () => {
        return `http://viacep.com.br/ws/${this.state.cep}/json/`;
    }

    componentDidMount(){
        const params = this.props.match.params
       
        if(params.id){
            this.service
                .obterPorId(params.id)
                .then(response => {
                    this.setState( {...response.data, atualizando: true} )
                })
                .catch(erros => {
                    messages.mensagemErro(erros.response.data)
                })
        }
    }

    submit = () => {
        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')
        const { nome, email, cpf, tipo, cep, logradouro, bairro, cidade, uf, numeroTelefone } = this.state;

        const removeFormatacaoCep = this.state.cep?.replace(/[^0-9]/g, '');
        const removeFormatacaoCpf = this.state.cpf?.replace(/[^0-9]/g, '');
        const removeFormatacaoTelefone = this.state.numeroTelefone?.replace(/[^0-9]/g, '');

        const cliente = { nome, email, cpf: removeFormatacaoCpf, tipo, cep: removeFormatacaoCep, logradouro, bairro, cidade, uf, numeroTelefone: removeFormatacaoTelefone, usuario: usuarioLogado.id };

        try{
            this.service.validar(cliente)
        }catch(erro){
            const mensagens = erro.mensagens;
            mensagens.forEach(msg => messages.mensagemErro(msg));
            return false;
        }
        
        this.service.salvar(cliente)
            .then(response => {
                this.props.history.push('/consulta-clientes')
                messages.mensagemSucesso('Cliente cadastrado com sucesso!')
            }).catch(error => {
                messages.mensagemErro(error.response.data)
            })
    }

    atualizar = () => {
        const { nome, email, cpf, tipo, cep, logradouro, bairro, cidade, uf, numeroTelefone, id } = this.state;
        const cliente = { nome, email, cpf, tipo, cep, logradouro, bairro, cidade, uf, numeroTelefone, id };
        
        this.service.atualizar(cliente)
            .then(response => {
                this.props.history.push('/consulta-clientes')
                messages.mensagemSucesso('Cliente atualizado com sucesso!')
            }).catch(error => {
                messages.mensagemErro(error.response.data)
            })
    }

    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;

        this.setState({ [name] : value }, () => {      
            this.buscarCep();
        });
    }

    buscarCep() {
        if(this.state.cep.length < 8) {
            return;
        } else {      
             fetch(this.url(), {mode: 'cors'})
              .then((res) => res.json())
              .then((data) => {
                  if (data.hasOwnProperty("erro")) {
                      this.setState({data: this.state});
                      alert('Cep não existente');
                  } else {
                    this.setState({ uf : data.uf })
                    this.setState({ cidade : data.localidade })
                    this.setState({ bairro : data.bairro })
                    this.setState({ logradouro : data.logradouro })
                  }
              })
              .catch(err => console.log(err));
        }
    }

    render( ){
        const tipos = this.service.obterListaTiposTelefone();
        
        return (
            <Card title={ this.state.atualizando ? 'Atualização de Cliente'  : 'Cadastro de Cliente' }>
                <div className="row">
                    <div className="col-md-12">
                        <FormGroup id="inputNome" label="Nome: *" >
                            <input id="inputNome" type="text" 
                                   className="form-control" 
                                   name="nome"
                                   value={this.state.nome}
                                   onChange={this.handleChange}  />
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
                                   onChange={this.handleChange}  />
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
                                   onChange={this.handleChange}  />
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
                                   onChange={this.handleChange}/>
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
                                   onChange={this.handleChange}  />
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
                                   onChange={this.handleChange}  />
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
                                   onChange={this.handleChange}  />
                        </FormGroup>
                    </div>

                    <div className="col-md-6">
                        <FormGroup id="inputUf" label="UF:" >
                            <input type="text" id="inputUf"
                                   className="form-control" 
                                   name="uf"
                                   value={this.state.uf}
                                   onChange={this.handleChange}  />
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
                                        className="form-control" />
                        </FormGroup>
                    </div>    
                    
                    <div className="col-md-4">
                        <FormGroup id="inputNumero" label="Número:" >
                            <InputMask id="inputNumero"
                                   mask="(99)99999-9999"
                                   className="form-control" 
                                   name="numeroTelefone"
                                   value={this.state.numeroTelefone}
                                   onChange={this.handleChange}  />
                        </FormGroup>
                    </div>
                </div>

                <div className="row">
                     <div className="col-md-6" >
                        { this.state.atualizando ? 
                            (
                                <button onClick={this.atualizar} 
                                        className="btn btn-success">
                                        <i className="pi pi-refresh"></i> Atualizar
                                </button>
                            ) : (
                                <button onClick={this.submit} 
                                        className="btn btn-success">
                                        <i className="pi pi-save"></i> Salvar
                                </button>
                            )
                        }
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

export default withRouter(CadastroClientes);