import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Permit } from "permitio";
import { NextResponse } from "next/server";

const permit = new Permit({
  token: process.env.PERMIT_API_KEY,
  pdp: "http://localhost:7766",
});

// Mock database
const posts = [
  { id: "1", title: "First Post", content: "Hello world!", authorId: "user1" },
  { id: "2", title: "Second Post", content: "Another post", authorId: "user2" },
];

export async function GET(request, { params }) {
  const postId = params.postId;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // Check permission using Permit
  const permitted = await permit.check(vendorEmail, "edit", `post:${postId}`);

  if (!permitted) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  return NextResponse.json(post);
}

export async function PUT(request, { params }) {
  const postId = params.postId;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // Check permission using Permit
  const permitted = await permit.check(
    session.user.email,
    "edit",
    `post:${postId}`
  );

  if (!permitted) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  // Update post logic would go here
  return NextResponse.json({ message: "Post updated successfully" });
}
