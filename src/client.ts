import * as request from 'request'

export type ClientMethod = (
  url: string, options: { form?: any, body?: any } & any,
  callback: (err: Error, response: any, body: string) => void) => void

export type StreamLineClient = {
  get: ClientMethod,
  post: ClientMethod,
  put: ClientMethod,
  delete: ClientMethod,
}

export const createStreamLineClient = async (username: string, password: string): Promise<StreamLineClient> => {
  const _request = request.defaults({ jar: true, followAllRedirects: true })

  return new Promise<StreamLineClient>((resolve, reject) => {
    _request.post('https://admin.streamlinevrs.com/auth_login.html', {
      form: {
        adminarea    : '.admin',
        user_login   : username,
        user_password: password,
        submit_login : 'yes',
      },
    }, (err, _, body) => {
      if (err)
        return reject(err)

      if ((body as string).includes('login_form'))
        return reject(new Error('Login failed'))

      return resolve(_request)
    })
  })
}

export const clientGet = (
  client: StreamLineClient, url: string,
  options: any = {}): Promise<{ response: request.Response, body: string | any }> => {
  return new Promise(
    (resolve, reject) => client.get(url, options, (err, response, body) => {
      if (err)
        return reject(err)

      resolve({ response, body })
    }))
}

export const clientPost = (
  client: StreamLineClient, url: string,
  options: any = {}): Promise<{ response: request.Response, body: string | any }> => {
  return new Promise(
    (resolve, reject) => client.post(url, options, (err, response, body) => {
      if (err)
        return reject(err)

      resolve({ response, body })
    }))
}