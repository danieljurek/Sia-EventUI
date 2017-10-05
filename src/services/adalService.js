import { Msal } from 'msal'
import * as authActions from '../actions/authActions'

// eslint-disable-next-line no-undef
export const clientId = CLIENT_ID //From config
export const authority = 'https://login.microsoftonline.com/'
// eslint-disable-next-line no-undef
export const tenant = AAD_TENANT
export const specificAuthority = authority + tenant

export const authContext = (dispatch) => {
  debugger
  var msalInstance = Msal
  var authC = msalInstance.UserAgentApplication(
    clientId,
    specificAuthority,
    userSignedIn(dispatch),
    {
      // eslint-disable-next-line no-undef
      redirectUri: AUTH_REDIRECT_URI
    }
  )
  return authC
}

/*new AuthenticationContext({
      instance: 'https://login.microsoftonline.com/',
      // eslint-disable-next-line no-undef
      tenant: AAD_TENANT, //From config
      // eslint-disable-next-line no-undef
      redirectUri: AUTH_REDIRECT_URI, //From config
      clientId: clientId,

      popUp: true
  })*/

/*export const ADAL = dispatch => {
  const context = authContext
  context.callback = userSignedIn(dispatch)
  return context
}*/

export const userSignedIn = (dispatch) => (err) => {
  if (err) {
    dispatch(authActions.userLoginError(err))
    return
  }
  setTimeout(dispatch, null, authActions.onLoginActions())
}


/*const callbackBridge = (resolve, reject) => (errDesc, token, err, tokenType) => {
  if(errDesc){
    reject(errDesc)
    return
  }
  resolve(token)
}

const dispatchOnResolve = (resolve, dispatch, action) => (reason) => {
  dispatch(action)
  resolve(reason)
}*/

export const tokenPromise = (dispatch) => new Promise((resolve, reject) => {
  var auth = authContext(dispatch)
  auth.registerCallback('Unused Scope', clientId, resolve, reject)
  if(!auth.getUser()) {
    auth.loginRedirect()
  }
  else {
    return auth.acquireTokenSilent(['Unused Scope'], specificAuthority)
  }
})
/*
  authContext(dispatch).acquireToken(clientId, callbackBridge(resolve, reject))
}).catch((reason)=> {
  if(reason && reason === 'User login is required'){
    return new Promise((innerResolve, innerReject) => {
      dispatch(authActions.loginInProgress())
      authContext.callback = callbackBridge(dispatchOnResolve(innerResolve, dispatch, authActions.userLoggedIn()), innerReject)
      authContext.login()
    })
  }
})
*/
