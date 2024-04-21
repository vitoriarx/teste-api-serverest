/// <reference types='cypress' />
import {token} from '../support/commands'
import {cadastrarProduto} from '../support/commands'


describe('Teste da funcionalidade produto', () => {
    let token 

    before(() => {
        
        cy.token('fulano@qa.com', 'teste').then(tkn => {token = tkn})
    });

    it('Listar produtos', () => {
        cy.request({
            method: 'GET',
            url: 'http://localhost:3000/produtos'
        }).then((response) => {
            //expect(response.body.produtos[2].nome).to.equal('Logitech MX Vertical')
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('produtos')
            expect(response.duration).to.be.lessThan(20) //define a velocidade em milisegundos que o teste tem que rodar
        })
    });

    it('Cadastrar produto', () => {
        let produto = `Produto EBAC ${Math.floor(Math.random() * 100)}` //Para gerar numero aleatorio no final para o produto ser dinamico
        cy.request({
            method: 'POST',
            url : 'http://localhost:3000/produtos',
            body: {
                    "nome": produto,
                    "preco": 334,
                    "descricao": "samsung",
                    "quantidade": 332
            },
            headers: {authorization: token } 
        }).then((response) => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })
    });

    it("Deve validar mensagem de erro ao cadastrar produto repetido", () => {
        cy.cadastrarProduto(token, "Produto EBAC Novo", 250, "Descrição do produto novo", 180 )

        .then((response) => {
            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal('Já existe produto com esse nome')
        })
    })

    it("Deve editar um produto já cadastrado", () => {
        cy.request('http://localhost:3000/produtos').then(response => {
            let id = response.body.produtos[0]._id
            cy.request({
                method : 'PUT',
                url : `http://localhost:3000/produtos/${id}`,
                headers: {authorization : token},
                body : {
                    "nome" : "Produto editado 45642083",
                    "preco" : 203,
                    "descricao" : "Produto editado",
                    "quantidade" : 332
                }
            }).then(response => {
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })
        })
    })

    it("Deve editar um produto cadastrado previamente", () => {
        let produto = `Produto EBAC ${Math.floor(Math.random() * 200)}`
        cy.cadastrarProduto(token, produto, 250, "Descrição do produto novo", 180)
        .then(response => {
            let id = response.body._id
            
            cy.request({
                method: 'PUT',
                url : `http://localhost:3000/produtos/${id}`,
                headers : {authorization : token},
                body : {
                    "nome" : produto,
                    "preco" : 2210,
                    "descricao" : "Produto editado",
                    "quantidade" : 322
                }
            }).then(response => {
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })
        })
    })

    it('Deve deletar um produto previamente cadastrado', () => {
        let produto = `Produto EBAC ${Math.floor(Math.random() * 100)}`
        cy.cadastrarProduto(token, produto, 250, "Descrição do produto novo", 180)
        .then(response => {
            let id = response.body._id
            cy.request({
                method : 'DELETE',
                url : `http://localhost:3000/produtos/${id}`,
                headers : {authorization : token}
            }).then(response => { 
                expect(response.body.message).to.equal("Registro excluído com sucesso" || "Nenhum registro excluído")
                expect(response.status).to.equal(200)
            })
        })
    })
    
})
