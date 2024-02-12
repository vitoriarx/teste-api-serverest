/// <reference types="cypress" />

describe('Testes de funcionalidade Produtos', () => {

    it('Listar produtos', () => {
        cy.request({
            method: 'GET',
            url: 'http://localhost:3000/produtos'
        }).then((response) => {
            expect(response.body.produtos[2].nome).to.equal('Samsung 60 polegadas')
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('produtos')
            expect(response.duration).to.be.lessThan(15)
        })
    });

    it.only('Cadastrar produto', () => {
        cy.request({
            method: 'POST',
            url: 'produtos',
            body: {
                "nome" : "Produtos APPLE VISION PRO",
                // É necessesário criar produto dinamicamente
                "preco" : 2300,
                "descricao" : "Produto novo",
                "quantidade" : 20
            },
            headers : {authorization : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZ1bGFub0BxYS5jb20iLCJwYXNzd29yZCI6InRlc3RlIiwiaWF0IjoxNzA3NzY1ODI0LCJleHAiOjE3MDc3NjY0MjR9.CIM1o1_Mz791lre65-4tk6q39MLSTLcrPWx_pWLWiP0'}
            // É necessário também criar token dinamicamente
        }).then((response) => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })
    })
})