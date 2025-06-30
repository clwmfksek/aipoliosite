import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse form data
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '모든 필수 필드를 입력해주세요.',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '올바른 이메일 주소를 입력해주세요.',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Validate message length
    if (message.trim().length < 10) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '메시지는 최소 10자 이상 입력해주세요.',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Log the contact form submission (in a real app, you might send an email or save to database)
    console.log('Contact Form Submission:', {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
    });

    // TODO: In a real application, you would:
    // 1. Send an email notification using a service like SendGrid, Nodemailer, etc.
    // 2. Save the submission to a database
    // 3. Send an auto-reply to the user

    // For now, we'll simulate a successful submission
    // You can replace this with actual email/database logic

    // Example email service integration:
    // await sendEmail({
    //   to: 'your.email@example.com',
    //   from: 'noreply@yoursite.com',
    //   subject: `Contact Form: ${subject}`,
    //   html: `
    //     <h2>새로운 연락 요청</h2>
    //     <p><strong>이름:</strong> ${name}</p>
    //     <p><strong>이메일:</strong> ${email}</p>
    //     <p><strong>제목:</strong> ${subject}</p>
    //     <p><strong>메시지:</strong></p>
    //     <p>${message.replace(/\n/g, '<br>')}</p>
    //   `
    // });

    return new Response(
      JSON.stringify({
        success: true,
        message: '메시지가 성공적으로 전송되었습니다!',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Contact form submission error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

// Handle preflight requests for CORS
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
