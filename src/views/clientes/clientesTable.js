import React from 'react'

export default props => {

    const rows = props.clientes.map(cliente => {
        console.log(props);

        return (
            <tr key={cliente.id}>
                <td>{cliente.nome}</td>
                <td>{cliente.email}</td>
                <td>
                    <button type="button"   title="Editar"
                            className="btn btn-primary"
                            disabled = { props.usuarioLogado === 'comum'}
                            onClick={e => props.editAction(cliente.id)}>
                            <i className="pi pi-pencil"></i>
                    </button>
                    <button type="button"  title="Excluir"
                            className="btn btn-danger" 
                            onClick={ e => props.deleteAction(cliente)}
                            disabled = { props.usuarioLogado === 'comum'} >
                            <i className="pi pi-trash"></i>
                    </button>
                    <button type="button" title="Visualizar"
                            className="btn btn-primary"
                            onClick={e => props.viewAction(cliente.id)}>
                            <i className="pi pi-check"></i>
                    </button>
                </td>
            </tr>
        )
    } )

    return (
        <table className="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">Email</th>
                    <th scope="col">Ações</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    )
}