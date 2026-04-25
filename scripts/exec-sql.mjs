import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://jynrsffbmabitqdxvqci.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5bnJzZmZibWFiaXRxZHh2cWNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTk5NzAwNCwiZXhwIjoyMDkxNTczMDA0fQ.De-I7oPXQPfkQOPVdBmK-wBNvIfOLO8ouya-kZ94lwc'
)

const { data, error } = await supabase
  .from('companies')
  .insert([
    { name: 'HOYU' },
    { name: '三和酒類' },
  ])
  .select()

if (error) {
  console.error('エラー:', error.message)
} else {
  console.log('成功:', data)
}
