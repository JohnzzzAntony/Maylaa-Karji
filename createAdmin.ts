import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
const prisma = new PrismaClient();

async function createAdmin() {
  const email = 'admin_test@karji.com';
  const password = 'SuperSecretPassword123!';
  
  console.log('Creating user in Supabase...');
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name: 'Admin Test' }
    }
  });

  if (error) {
    console.error('Supabase Auth Error:', error.message);
    return;
  }

  const userId = data.user?.id;
  if (!userId) {
    console.error('No user ID returned from Supabase.');
    return;
  }

  console.log('Created in Supabase with ID:', userId);

  console.log('Upserting user in Prisma DB as superadmin...');
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role: 'superadmin',
      id: userId // ensure ID matches
    },
    create: {
      id: userId,
      email,
      name: 'Admin Test',
      password: '',
      role: 'superadmin'
    }
  });

  console.log('Prisma User:', user);
  console.log('\n--- SUCCESS ---');
  console.log('You can now login on the frontend with:');
  console.log('Email:', email);
  console.log('Password:', password);
}

createAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
