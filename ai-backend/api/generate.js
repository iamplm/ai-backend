{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // api/generate.js\
\
export default async function handler(req, res) \{\
  // Allow cross-origin requests (important for your frontend on Hostinger)\
  res.setHeader("Access-Control-Allow-Origin", "*");\
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");\
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");\
\
  if (req.method === "OPTIONS") \{\
    return res.status(200).end();\
  \}\
\
  try \{\
    // Parse the JSON request body\
    const \{ prompt, tone, hashtagsCount \} = await req.json();\
\
    // Call OpenAI API\
    const response = await fetch("https://api.openai.com/v1/chat/completions", \{\
      method: "POST",\
      headers: \{\
        "Content-Type": "application/json",\
        Authorization: `Bearer $\{process.env.OPENAI_API_KEY\}`, // we will set this in Vercel\
      \},\
      body: JSON.stringify(\{\
        model: "gpt-4o-mini",\
        messages: [\
          \{\
            role: "user",\
            content: `Generate a creative Instagram caption and $\{hashtagsCount\} hashtags for: "$\{prompt\}". Tone: $\{tone\}.`,\
          \},\
        ],\
        temperature: 0.8,\
        max_tokens: 200,\
      \}),\
    \});\
\
    const data = await response.json();\
\
    const caption = data?.choices?.[0]?.message?.content?.trim() || "No caption generated.";\
\
    res.status(200).json(\{ caption \});\
  \} catch (error) \{\
    console.error(error);\
    res.status(500).json(\{ error: "Something went wrong on the server." \});\
  \}\
\}\
}