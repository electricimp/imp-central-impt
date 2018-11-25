
class AgentTestCase2 extends ImpTestCase {
  function testAgentServerError() {
      AgentServerError().sendError();
      assertTrue(true, "Should still get the line executed");
  }
}
