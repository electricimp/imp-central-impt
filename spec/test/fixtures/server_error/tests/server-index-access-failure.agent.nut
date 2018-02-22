
class AgentTestCase extends ImpTestCase {
  function testAgentServerError() {
      AgentServerError().checkFieldDoesNotExist();
      // should never get next line executed
      server.error("If you see this message, something went wrong!!!");
  }
}
