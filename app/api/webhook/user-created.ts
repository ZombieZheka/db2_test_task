// app/api/webhook/user-created.ts

import { prisma } from "@/app/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id, email_addresses } = req.body;
    const email = email_addresses[0]?.email_address;

    if (!id || !email) {
      return res.status(400).json({ error: "Invalid data" });
    }

    await prisma.user.create({
      data: {
        clerkId: id,
        email,
      },
    });

    return res
      .status(200)
      .json({
        message: "User created successfully"
      }
    );
  } catch (error) {
    console.error("Error handling webhook:", error);
    return res
      .status(500)
      .json({
        error: "Internal server error"
      }
    );
  }
}
