import { ICredential } from '@sphereon/ssi-types'
import { VerifiableCredential } from '@veramo/core/src/types/vc-data-model'

import { CredentialStatusEnum, ICredentialDetailsRow, ICredentialSummary } from '../../@types'

const { v4: uuidv4 } = require('uuid')

function toCredentialDetailsRow(object: Object, level: number): ICredentialDetailsRow[] {
  let rows: ICredentialDetailsRow[] = []
  // console.log(`OBJECT: ${JSON.stringify(object, null, 2)}`)
  for (const [key, value] of Object.entries(object)) {
    /* if (value === undefined) {
      continue
    }*/

    // TODO fix hacking together the image
    if (key.toLowerCase().includes('image') /*&& (typeof value === 'string' || value.type?.toLowerCase() === 'image')*/) {
      let image
      if (typeof value === 'string') {
        image = value
      } else if (value.id) {
        image = value.id
      }
      console.log(`VALUE: ${image}` )
      console.log(`IMAGE!!!!!${key}:${JSON.stringify(value)}`)
      if (image) {
        console.log('Image added')
        rows.push({
          level,
          id: uuidv4(),
          label: 'image',
          value: image
        })
      }

      continue
    } else if (key === 'type') {
      rows.push({
        level,
        id: uuidv4(),
        label: key,
        value: value
      })
      continue
    }

    if (typeof value !== 'string') {
      rows.push({
        level,
        id: uuidv4(),
        label: key,
        value: undefined
      })
      console.log(`NON STRING:${key}`)
      rows = rows.concat(toCredentialDetailsRow(value, level ? level + 1: undefined ))
    } else {
      console.log(`==>${key}:${value}`)
      let label = key === '0' ? `${value}` : key
      if (key === 'id' && value.startsWith('did:')) {
        label = 'subject'
      }
      rows.push({
        level,
        id: uuidv4(),
        label, // TODO Human readable mapping
        value: key === '0' ? undefined : value
      })
    }
  }

  return rows
}

export function toCredentialSummary(verifiableCredential: ICredential, hash?: string): ICredentialSummary {
  const expirationDate = verifiableCredential.expirationDate
    ? new Date(verifiableCredential.expirationDate).valueOf() / 1000
    : 0
  const issueDate = new Date(verifiableCredential.issuanceDate).valueOf() / 1000
  const credentialStatus =
    !expirationDate || expirationDate >= new Date().valueOf() / 1000
      ? CredentialStatusEnum.VALID
      : CredentialStatusEnum.EXPIRED
  //TODO add revoked status support

  const title = verifiableCredential.name
    ? verifiableCredential.name
    : !verifiableCredential.type
    ? 'unknown'
    : typeof verifiableCredential.type === 'string'
    ? verifiableCredential.type
    : verifiableCredential.type.filter((value) => value !== 'VerifiableCredential')[0]
  console.log(`TITLE: ${title}`)
  const signedBy =
    typeof verifiableCredential.issuer === 'string'
      ? verifiableCredential.issuer
      : verifiableCredential.issuer?.name
      ? verifiableCredential.issuer?.name
      : verifiableCredential.issuer?.id

  console.log(`Signed by: ${signedBy}`)
  console.log(`Credential Subject: ${verifiableCredential.credentialSubject}`)
  const properties = toCredentialDetailsRow(verifiableCredential.credentialSubject, 1)

  const name =
    typeof verifiableCredential.issuer === 'string'
      ? verifiableCredential.issuer
      : verifiableCredential.issuer?.name
      ? verifiableCredential.issuer?.name
      : verifiableCredential.issuer?.id
  return {
    id: hash ? hash : verifiableCredential.id ? verifiableCredential.id : 'todo',
    title,
    issuer: {
      name: name.length > 50 ? `${name.substring(0, 50)}...` : name,

      image: typeof verifiableCredential.issuer !== 'string' ? verifiableCredential.issuer.image : undefined,
      url: typeof verifiableCredential.issuer !== 'string' ? verifiableCredential.issuer.url : undefined
    },
    credentialStatus,
    issueDate,
    expirationDate,
    properties,
    signedBy
  }
}
