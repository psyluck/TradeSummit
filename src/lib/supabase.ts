import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Organization {
  id: string;
  name: string;
  domain?: string;
  industry?: string;
  size?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  status: 'active' | 'suspended' | 'cancelled';
  settings?: any;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  organization_id?: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'admin' | 'user';
  avatar_url?: string;
  last_login?: string;
  preferences?: any;
  created_at: string;
  updated_at: string;
  organization?: Organization;
}

export interface Subscription {
  id: string;
  organization_id: string;
  plan_name: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid';
  current_period_start: string;
  current_period_end: string;
  monthly_price: number;
  setup_fee: number;
  payment_provider?: 'stripe' | 'payoneer';
  external_subscription_id?: string;
  usage_limits?: any;
  created_at: string;
  updated_at: string;
}

export interface AIAgent {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  industry?: string;
  status: 'training' | 'active' | 'paused' | 'error';
  configuration?: any;
  performance_metrics?: any;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  organization_id: string;
  ai_agent_id: string;
  customer_id?: string;
  customer_email?: string;
  status: 'active' | 'resolved' | 'escalated';
  satisfaction_score?: number;
  resolution_time?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
  ai_agent?: AIAgent;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_type: 'user' | 'agent' | 'system';
  content: string;
  metadata?: any;
  created_at: string;
}

export interface Integration {
  id: string;
  organization_id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'error';
  configuration?: any;
  last_sync?: string;
  created_at: string;
  updated_at: string;
}

export interface Analytics {
  id: string;
  organization_id: string;
  ai_agent_id?: string;
  metric_type: string;
  metric_value: number;
  period_start: string;
  period_end: string;
  metadata?: any;
  created_at: string;
}

export interface Invoice {
  id: string;
  organization_id: string;
  subscription_id: string;
  invoice_number: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  due_date: string;
  paid_at?: string;
  payment_provider?: string;
  external_invoice_id?: string;
  line_items?: any[];
  created_at: string;
  updated_at: string;
}

export interface SystemLog {
  id: string;
  organization_id?: string;
  user_id?: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  details?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Auth helpers
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Database helpers
export const getOrganizations = async () => {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getUsers = async (organizationId?: string) => {
  let query = supabase
    .from('users')
    .select(`
      *,
      organization:organizations(*)
    `);
  
  if (organizationId) {
    query = query.eq('organization_id', organizationId);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  return { data, error };
};

export const getAIAgents = async (organizationId?: string) => {
  let query = supabase
    .from('ai_agents')
    .select('*');
  
  if (organizationId) {
    query = query.eq('organization_id', organizationId);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  return { data, error };
};

export const getConversations = async (organizationId?: string) => {
  let query = supabase
    .from('conversations')
    .select(`
      *,
      ai_agent:ai_agents(name, industry)
    `);
  
  if (organizationId) {
    query = query.eq('organization_id', organizationId);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  return { data, error };
};

export const getAnalytics = async (organizationId?: string, agentId?: string) => {
  let query = supabase
    .from('analytics')
    .select('*');
  
  if (organizationId) {
    query = query.eq('organization_id', organizationId);
  }
  
  if (agentId) {
    query = query.eq('ai_agent_id', agentId);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  return { data, error };
};

export const getInvoices = async (organizationId?: string) => {
  let query = supabase
    .from('invoices')
    .select('*');
  
  if (organizationId) {
    query = query.eq('organization_id', organizationId);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  return { data, error };
};

export const createAIAgent = async (agentData: Partial<AIAgent>) => {
  const { data, error } = await supabase
    .from('ai_agents')
    .insert([agentData])
    .select()
    .single();
  return { data, error };
};

export const updateAIAgent = async (id: string, updates: Partial<AIAgent>) => {
  const { data, error } = await supabase
    .from('ai_agents')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const deleteAIAgent = async (id: string) => {
  const { error } = await supabase
    .from('ai_agents')
    .delete()
    .eq('id', id);
  return { error };
};

// Real-time subscriptions
export const subscribeToConversations = (organizationId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('conversations')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'conversations',
        filter: `organization_id=eq.${organizationId}`,
      },
      callback
    )
    .subscribe();
};

export const subscribeToMessages = (conversationId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('messages')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      callback
    )
    .subscribe();
};