/// <reference types="cypress" />
const { faker } = require('@faker-js/faker');
var firstName = faker.person.firstName()
var lastName = faker.person.lastName()
var country = 'Brasil'
var email = faker.internet.email({ firstName: `${firstName}` })
var password = faker.internet.password({ length: 10 })
var address = 'Rua dos testes, 55, apto 301'
var city = 'Porto Alegre'
var state = 'Rio Grande do Sul'
var zipcode = faker.location.zipCode('#####-###')
var telephone = faker.phone.number('## #########')
var dadosProdutos

context('Exercicio - Testes End-to-end - Fluxo de pedido', () => {

    before(() => {
        cy.fixture('itemsList')
            .then(itemsList => {
                dadosProdutos = itemsList
            })
    });

    beforeEach(() => {
        cy.visit('minha-conta')
    });

    it.only('Deve fazer um pedido na loja Ebac Shop de ponta a ponta', () => {
        cy.registerNewUser(email, password)
        cy.get('#primary-menu > .menu-item-629 > a')
            .click()
        cy.addProductToCart(dadosProdutos[0].productName,
            dadosProdutos[0].color,
            dadosProdutos[0].size,
            dadosProdutos[0].quantity)
        cy.addProductToCart(dadosProdutos[1].productName,
            dadosProdutos[1].size,
            dadosProdutos[1].color,
            dadosProdutos[1].quantity)
        cy.get(':nth-child(2) > .page-numbers')
            .click()
        cy.addProductToCart(dadosProdutos[2].productName,
            dadosProdutos[2].color,
            dadosProdutos[2].size,
            dadosProdutos[2].quantity)
        cy.get(':nth-child(2) > .page-numbers')
            .click()
        cy.addProductToCart(dadosProdutos[3].productName,
            dadosProdutos[3].size,
            dadosProdutos[3].color,
            dadosProdutos[3].quantity)
        cy.get('.dropdown-toggle > .text-skin > .icon-basket')
            .click()
        cy.get('#cart > .dropdown-menu > .widget_shopping_cart_content > .mini_cart_content > .mini_cart_inner > .mcart-border > .buttons > .checkout')
            .click()
        cy.checkoutFormFill(firstName, lastName, country, address, city, state, zipcode, telephone)
        cy.get('#terms')
            .check()
        cy.get('#place_order')
            .click()
                cy.get('.page-title')
                    .should('contain', 'Pedido recebido')
                cy.get('tbody > :nth-child(1) > .woocommerce-table__product-name')
                    .should('contain', dadosProdutos[0].productName)
                cy.get('tbody > :nth-child(4) > .woocommerce-table__product-name')
                    .should('contain', dadosProdutos[3].productName)
                cy.get('tbody > :nth-child(2) > .woocommerce-table__product-name')
                    .should('contain', dadosProdutos[1].productName)
                cy.get('tbody > :nth-child(3) > .woocommerce-table__product-name')
                    .should('contain', dadosProdutos[2].productName)
    });
})