import React from 'react'
import { withRouter } from 'react-router-dom'

import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import ClientesTable from './clientesTable'
import clienteService from '../../app/service/clienteService'
import LocalStorageService from '../../app/service/localstorageService'

import * as messages from '../../components/toastr'

import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';

class ConsultaClientes extends React.Component {

    state = {
        nome: '',
        email: '',
        showConfirmDialog: false,
        clienteDeletar: {},
        clientes : []
    }

    usuarioLogado = '';

    constructor(){
        super();
        this.service = new clienteService();
        this.usuarioLogado = LocalStorageService.obterItem('_usuario_logado').nome;
    }

    buscar = () => {
        const clienteFiltro = {
            nome: this.state.nome,
            email: this.state.email,
        }

        this.service.consultar(clienteFiltro)
            .then( resposta => {
                const lista = resposta.data;
                
                if(lista.length < 1){
                    messages.mensagemAlert("Nenhum resultado encontrado.");
                }
                this.setState({ clientes: lista })
            }).catch( error => {
                console.log(error)
            })
    }

    editar = (id) => {
        this.props.history.push(`/cadastro-clientes/${id}`)
    }

    editar2 = (id) => {
        this.props.history.push(`/visualizar-clientes/${id}`)
    }

    abrirConfirmacao = (cliente) => {
        this.setState({ showConfirmDialog : true, clienteDeletar: cliente  })
    }

    cancelarDelecao = () => {
        this.setState({ showConfirmDialog : false, clienteDeletar: {}  })
    }

    deletar = () => {
        this.service
            .deletar(this.state.clienteDeletar.id)
            .then(response => {
                const clientes = this.state.clientes;
                const index = clientes.indexOf(this.state.clienteDeletar)
                clientes.splice(index, 1);
                this.setState( { clientes: clientes, showConfirmDialog: false } )
                messages.mensagemSucesso('Cliente deletado com sucesso!')
            }).catch(error => {
                messages.mensagemErro('Ocorreu um erro ao tentar deletar o Cliente')
            })
    }

    preparaFormularioCadastro = () => {
        this.props.history.push('/cadastro-clientes')
    }

    render(){
        const confirmDialogFooter = (
            <div>
                <Button label="Confirmar" icon="pi pi-check" onClick={this.deletar} />
                <Button label="Cancelar" icon="pi pi-times" onClick={this.cancelarDelecao} 
                        className="p-button-secondary" />
            </div>
        );

        return (
            <Card title="Consulta Clientes">
                <div className="row">
                    <div className="col-md-6">
                        <div className="bs-component">
                            <FormGroup htmlFor="inputNome" label="Nome:">
                                <input type="text" 
                                       className="form-control" 
                                       id="inputAno" 
                                       value={this.state.nome}
                                       onChange={e => this.setState({nome: e.target.value})}
                                       placeholder="Digite o Nome" />
                            </FormGroup>

                            <FormGroup htmlFor="inputEmail" label="Email: ">
                                <input type="text" 
                                       className="form-control" 
                                       id="inputEmail" 
                                       value={this.state.email}
                                       onChange={e => this.setState({email: e.target.value})}
                                       placeholder="Digite o email" />
                            </FormGroup>

                            <button onClick={this.buscar} 
                                    type="button" 
                                    className="btn btn-success">
                                    <i className="pi pi-search"></i> Buscar
                            </button>
                            <button onClick={this.preparaFormularioCadastro} 
                                    type="button" 
                                    className="btn btn-danger"
                                    disabled = { this.usuarioLogado === 'comun'} >
                                    <i className="pi pi-plus"></i> Cadastrar
                            </button>

                        </div>
                        
                    </div>
                </div>   
                <br/ >
                <div className="row">
                    <div className="col-md-12">
                        <div className="bs-component">
                            <ClientesTable clientes={this.state.clientes} 
                                              deleteAction={this.abrirConfirmacao}
                                              editAction={this.editar}
                                              viewAction={this.editar2}
                                              usuarioLogado={LocalStorageService.obterItem('_usuario_logado').nome}/>
                        </div>
                    </div>  
                </div> 
                <div>
                    <Dialog header="Confirmação" 
                            visible={this.state.showConfirmDialog} 
                            style={{width: '50vw'}}
                            footer={confirmDialogFooter} 
                            modal={true} 
                            onHide={() => this.setState({showConfirmDialog: false})}>
                        Confirma a exclusão deste Cliente?
                    </Dialog>
                </div>           
            </Card>

        )
    }
}

export default withRouter(ConsultaClientes);