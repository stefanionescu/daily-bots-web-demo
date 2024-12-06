// [POST] /api
import {
  defaultBotProfile,
  defaultMaxDuration,
  defaultServices,
} from "../../../rtvi.config";

export async function POST(request: Request) {
  const { services, config, rtvi_client_version } = await request.json();

  if (!services || !config || !process.env.DAILY_BOTS_URL || !process.env.ELEVEN_LABS_API_KEY) {
    return new Response(`Services, config, or required API keys not found`, {
      status: 400,
    });
  }

  const payload = {
    bot_profile: defaultBotProfile,
    max_duration: defaultMaxDuration,
    services: { 
      ...defaultServices, 
      ...services,
      elevenlabs: {
        ...defaultServices.elevenlabs,
        api_key: process.env.ELEVEN_LABS_API_KEY,
      },
    },
    api_keys: {
      openai: process.env.OPENAI_API_KEY,
      elevenlabs: process.env.ELEVEN_LABS_API_KEY,
    },
    config: [...config],
    rtvi_client_version,
  };

  const req = await fetch(process.env.DAILY_BOTS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DAILY_BOTS_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  const res = await req.json();

  if (req.status !== 200) {
    return Response.json(res, { status: req.status });
  }

  return Response.json(res);
}
