import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupStorage() {
  console.log("Setting up storage...")
  
  // Create bucket
  const { data: bucket, error: bucketError } = await supabase.storage.createBucket('resumes', {
    public: false,
    allowedMimeTypes: ['application/pdf'],
    fileSizeLimit: 5242880 // 5MB
  })
  
  if (bucketError && bucketError.message !== 'The resource already exists') {
    console.error("Error creating bucket:", bucketError)
    process.exit(1)
  }
  
  if (bucketError && bucketError.message === 'The resource already exists') {
    console.log("Bucket 'resumes' already exists.")
  } else {
    console.log("Bucket 'resumes' created successfully.")
  }

  // We need to create storage policies to allow users to upload, select, update, delete their own files
  // Since we don't have direct SQL access through JS client, we'll assume the user has to do it or we just use service_role to upload from the server action.
  // Using Server Actions with `supabaseAdmin` bypasses RLS for storage!
  // This is the easiest way: The client sends FormData to a Server Action. The Server Action uses the service_role key to upload to storage. 
  // Then the Server Action inserts a row into the `resumes` table using the user's regular `supabase` client (which has RLS).

  console.log("Setup complete.")
}

setupStorage()
