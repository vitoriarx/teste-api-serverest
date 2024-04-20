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
                    "preco": 32430,
                    "descricao": "televisao",
                    "quantidade": 200
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
    
})
