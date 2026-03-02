import { flow } from "./technical"

describe("technical flow", () => {
  it("exports correct shape", () => {
    expect(flow.persona).toBeTruthy()
    expect(flow.welcomeMessage).toBeTruthy()
    expect(flow.assignedTo).toBe("architect")
    expect(typeof flow.handleMessage).toBe("function")
  })
})
