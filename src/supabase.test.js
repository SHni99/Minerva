import { supabaseClient as supabase } from "config/supabase-client";
import "@testing-library/jest-dom";

const login = async (admin = false) =>
  supabase.auth.signIn({
    email: admin ? "test@test.com" : "debug@user.com",
    password: "TestUser123!",
  });

describe("Supabase Auth", () => {
  it("signs users in successfully", async () => {
    let { data, error } = await login();
    expect(error).not.toBeTruthy();
    expect(data).toBeTruthy();
  });

  it("signs users out successfully", async () => {
    let { error } = await supabase.auth.signOut();
    expect(error).not.toBeTruthy();
  });

  it("has a user() method that returns a valid object when logged in", async () => {
    // Should return null at first
    expect(supabase.auth.user()).not.toBeTruthy();

    // After login, method should return an object
    await login();
    expect(supabase.auth.user()).toBeTruthy();

    // Ensure the returned object has an id attribute
    expect(supabase.auth.user().id).toBeTruthy();
  });
});
