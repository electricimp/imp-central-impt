class AgentServerError {
  function sendError() {
    server.error("Send server error");
  }

  // NOTE: imptest should fail on
  //       this function call
  function checkThrowException() {
    throw "Check unhandled exception";
  }

  // NOTE: imptest should fail on
  //       this function call
  function checkFieldDoesNotExist() {
    this.fieldDoesNotExists = true;
  }
}
