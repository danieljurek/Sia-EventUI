'use strict'
import { expect } from 'chai'
import React from 'react'
import CreateComponent from '../../helpers/shallowRenderHelper'
import GetMockADAL from '../../helpers/mockAdal'
import GetMockStore from '../../helpers/mockReduxStore'
import { EnsureLoggedInContainer, mapStateToProps } from '../../../src/components/Auth/EnsureLoggedIn'
import Login from '../../../src/components/Auth/Login'
import LoginError from '../../../src/components/Auth/LoginError'

function setup(props, children) {
    return CreateComponent(EnsureLoggedInContainer, props, ...children)
}

const children = [<div></div>]

const errorState = {
    error: 'Test Error',
    isLoggedIn: true,
    ADAL: GetMockADAL(null),
    store: GetMockStore({auth:{error:'Test Error'}})
}

const notLoggedInState = {
    isLoggedIn: false,
    ADAL: GetMockADAL(null),
    store: GetMockStore({auth:{error:'Test Error'}})
}

const loggedInState = {
    isLoggedIn: true,
    ADAL: GetMockADAL(null),
    store: GetMockStore({auth:{error:'Test Error'}})
}

describe('EnsureLoggedIn', function test () {
    beforeEach( () => {
        this.errorOutput = setup(errorState, children)
        this.notLoggedInOutput = setup(notLoggedInState, children)
        this.loggedInOutput = setup(loggedInState, children)
    })

    it('Should render LoginError when error is present', () => {
        expect(this.errorOutput.type).to.equal(LoginError)
    })

    it('Should render Login when no error is present and user is not logged in', () => {
        expect(this.notLoggedInOutput.type).to.equal(Login)
    })

    it('Should render children when no error is present and user is logged in', () => {
        expect(this.loggedInOutput.type).to.equal('div')
    })
})