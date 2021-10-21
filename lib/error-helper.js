/*
 * Copyright 2020 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const NOTICED_ERRORS = Symbol('New Relic Noticed Errors')

class ErrorHelper {
  isValidRequestContext(instrumentationApi, requestContext) {
    if (!requestContext || !requestContext.errors || !Array.isArray(requestContext.errors)) {
      instrumentationApi.logger.trace('didEncounterErrors received malformed arguments, skipping')
      return false
    }
    return true
  }

  addErrorsFromApolloRequestContext(instrumentationApi, requestContext, ignoredStatusCodes) {
    if (!this.isValidRequestContext(instrumentationApi, requestContext)) {
      return
    }

    for (const error of requestContext.errors) {
      if (this.shouldErrorBeIgnored(error, ignoredStatusCodes)) {
        continue
      }

      if (!isErrorNoticed(error, requestContext)) {
        this.noticeError(instrumentationApi, error)
      }
    }
  }

  noticeError(instrumentationApi, error) {
    const transaction = instrumentationApi.tracer.getTransaction()
    instrumentationApi.agent.errors.add(transaction, error)
  }

  shouldErrorBeIgnored(error, ignoredStatusCodes = []) {
    const statusCode = error.status || error.originalError?.status || null

    if (statusCode && ignoredStatusCodes.indexOf(statusCode) >= 0) {
      return true
    }

    return false
  }
}

function isErrorNoticed(error, requestContext) {
  if (!error.originalError || !requestContext[NOTICED_ERRORS]) {
    return false
  }

  return requestContext[NOTICED_ERRORS].indexOf(error.originalError) >= 0
}

ErrorHelper.NOTICED_ERRORS = NOTICED_ERRORS

module.exports = ErrorHelper
