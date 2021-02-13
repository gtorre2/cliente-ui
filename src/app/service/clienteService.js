import ApiService from '../apiservice'

import ErroValidacao from '../exception/ErroValidacao'

export default class ClienteService extends ApiService {

    constructor(){
        super('/api/clientes')
    }

    obterListaTiposTelefone(){
        return  [
            { label: 'Selecione...', value: '' },
            { label: 'Residencial', value: 'RESIDENCIAL' },
            { label: 'Comercial', value: 'COMERCIAL' },
            { label: 'Celular', value: 'CELULAR' },
        ]
    }

    obterPorId(id){
        return this.get(`/${id}`);
    }

    validar(cliente){
        const erros = [];

        if(!cliente.nome){
            erros.push("Informe o Nome.")
        } else if(cliente.nome.length < 3) {
            erros.push("O nome deve ter no mínimo 3 caractes")
        } else if(cliente.nome.length > 100) {
            erros.push("O nome deve ter no máxima 100 caractes")
        }

        if(cliente.nome && !cliente.cpf){
            erros.push("Informe o CPF.")
        }

        if(cliente.nome && cliente.cpf && !cliente.cep){
            erros.push("Informe o CEP.")
        }

        if(cliente.nome && cliente.cpf && !cliente.email){
            erros.push('O campo Email é obrigatório.')
        }else if( !cliente.email.match(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]/) ){
            erros.push('Informe um Email válido.')
        }

        if(erros && erros.length > 0){
            throw new ErroValidacao(erros);
        }
    }

    salvar(cliente){
        console.log(cliente);
        return this.post('/', cliente);
    }

    atualizar(cliente){
        return this.put(`/${cliente.id}`, cliente);
    }

    consultar(clienteFiltro){
        let params = `?nome=${clienteFiltro.nome}`

        return this.get(params);
    }

    deletar(id){
        return this.delete(`/${id}`)
    }
}