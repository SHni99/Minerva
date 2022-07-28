import { supabaseClient as supabase } from "config/supabase-client";
import "@testing-library/jest-dom";

const login = async (admin = false) =>
  supabase.auth.signIn({
    email: admin ? "test@test.com" : "debug@user.com",
    password: "TestUser123!",
  });

describe("Supabase Auth", () => {
  it(".signIn() works correctly", async () => {
    let { data, error } = await login();
    expect(error).not.toBeTruthy();
    expect(data).toBeTruthy();
  });

  it(".signOut() works correctly", async () => {
    let { error } = await supabase.auth.signOut();
    expect(error).not.toBeTruthy();
  });

  it(".user() works correctly", async () => {
    // Should return null at first
    expect(supabase.auth.user()).not.toBeTruthy();

    // After login, method should return an object
    await login();
    expect(supabase.auth.user()).toBeTruthy();

    // Ensure the returned object has an id attribute
    expect(supabase.auth.user().id).toBeTruthy();
  });
});

describe("Table: Listings", () => {
  it("should return listings on SELECT for anon users", async () => {
    const { data, error } = await supabase.from("listings").select("*");
    expect(error).not.toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
  });

  it("should return listings on SELECT for authenticated users", async () => {
    login();
    const { data, error } = await supabase.from("listings").select("*");
    expect(error).not.toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
  });
});

describe("Table: Profiles", () => {
  it("should return profiles on SELECT for anon users", async () => {
    const { error: logoutError } = await supabase.auth.signOut();
    expect(logoutError).not.toBeTruthy();

    const { data, error } = await supabase.from("profiles").select("*");
    expect(error).not.toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
  });

  it("should return profiles on SELECT for authenticated users", async () => {
    await login();
    const { data, error } = await supabase.from("profiles").select("*");
    expect(error).not.toBeTruthy();

    // User should also see profiles other than user's own profile
    expect(data.length).toBeGreaterThan(1);
  });
});

describe("Table: Reviews", () => {
  it("should return reviews on SELECT for anon users", async () => {
    const { error: logoutError } = await supabase.auth.signOut();
    expect(logoutError).not.toBeTruthy();

    const { data, error } = await supabase.from("reviews").select("*");
    expect(error).not.toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
  });

  it("should return reviews on SELECT for authenticated users", async () => {
    await login();
    const { data, error } = await supabase.from("reviews").select("*");
    expect(error).not.toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
  });
});

describe("Table: Conversations", () => {
  it("should NOT return conversations on SELECT for anon users", async () => {
    const { error: logoutError } = await supabase.auth.signOut();
    expect(logoutError).not.toBeTruthy();

    const { data, error } = await supabase.from("conversations").select("*");
    expect(error).not.toBeTruthy();
    expect(data.length).toBe(0);
  });

  it("should return selective conversations on SELECT for authenticated users", async () => {
    await login();
    const { data, error } = await supabase.from("conversations").select("*");
    expect(error).not.toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
  });

  it("should return ALL conversations on SELECT for authenticated users", async () => {
    await login(true);
    const { data, error } = await supabase.from("conversations").select("*");
    expect(error).not.toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
  });
});

describe("Table: Messages", () => {
  it("should NOT return messages on SELECT for anon users", async () => {
    const { error: logoutError } = await supabase.auth.signOut();
    expect(logoutError).not.toBeTruthy();

    const { data, error } = await supabase.from("messages").select("*");
    expect(error).not.toBeTruthy();
    expect(data.length).toBe(0);
  });

  it("should return selective messages on SELECT for authenticated users", async () => {
    await login();
    const { data, error } = await supabase.from("messages").select("*");
    expect(error).not.toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
  });

  it("should return ALL messages on SELECT for authenticated users", async () => {
    await login(true);
    const { data, error } = await supabase.from("messages").select("*");
    expect(error).not.toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
  });
});

describe("Table: reports", () => {
  it("should NOT return reports on SELECT for anon users", async () => {
    const { error: logoutError } = await supabase.auth.signOut();
    expect(logoutError).not.toBeTruthy();

    const { data, error } = await supabase.from("reports").select("*");
    expect(error).not.toBeTruthy();
    expect(data.length).toBe(0);
  });

  it("should only return a user's own reports on SELECT for authenticated users", async () => {
    await login();
    const { data, error } = await supabase.from("reports").select("*");
    expect(error).not.toBeTruthy();
    expect(data.length).toBe(0);
  });

  it("should return ALL reports on SELECT for authenticated users", async () => {
    await login(true);
    const { data, error } = await supabase.from("reports").select("*");
    expect(error).not.toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
  });
});

describe("Table: Banned", () => {
  it("should NOT return ban info on SELECT for anon users", async () => {
    const { error: logoutError } = await supabase.auth.signOut();
    expect(logoutError).not.toBeTruthy();

    const { data, error } = await supabase.from("banned").select("*");
    expect(error).not.toBeTruthy();
    expect(data.length).toBe(0);
  });

  it("should only return a user's own ban data on SELECT for authenticated users", async () => {
    await login();
    const { data, error } = await supabase.from("banned").select("*");
    expect(error).not.toBeTruthy();
    expect(data.length).toBe(0);
  });

  it("should return ALL banned data on SELECT for authenticated users", async () => {
    await login(true);
    const { data, error } = await supabase.from("banned").select("*");
    expect(error).not.toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
  });
});

describe("Custom RPC Calls", () => {
  const mockUserIds = [
    "554f8ebe-56a3-4fb2-90ee-a5314dce190c",
    "a9fbf7d6-e8fb-4985-956c-f4e9dfb5cd0e",
  ];

  test("get_listings() should return data in the expected format", async () => {
    const colNames = [
      "listing_id",
      "created_at",
      "creator_id",
      "fields",
      "seeking_for",
      "level",
      "rates",
      "image_urls",
      "avg_rating",
      "num_reviews",
      "reviewee_id",
      "avatar_url",
      "username",
      "user_id",
    ];
    await login();
    const { data, error } = await supabase.rpc("get_listings");

    expect(error).not.toBeTruthy();
    expect(Object.keys(data[0]).toString()).toBe(colNames.toString());
  });

  test("has_convo() should return a boolean with the correct value", async () => {
    await login();
    const { data, error } = await supabase.rpc("has_convo", {
      id1: mockUserIds[0],
      id2: mockUserIds[1],
    });
    expect(error).not.toBeTruthy();
    expect(data).toBe(true);
  });

  test("get_messages() should return data in the expected format", async () => {
    const colNames = ["message_id", "payload", "sender_id", "created_at"];

    await login();
    let { data, error } = await supabase.rpc("get_messages", {
      id1: mockUserIds[0],
      id2: mockUserIds[1],
    });
    expect(error).not.toBeTruthy();
    expect(Object.keys(data[0]).toString()).toBe(colNames.toString());
  });
});
