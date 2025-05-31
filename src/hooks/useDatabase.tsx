
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { toast } from '@/components/ui/use-toast';

export type DatabaseRow = Tables<'database_rows'>;
export type DatabaseProperty = Tables<'database_properties'>;
export type DatabaseView = Tables<'database_views'>;
export type Database = Tables<'databases'>;

export const useDatabase = (databaseId?: string) => {
  const [database, setDatabase] = useState<Database | null>(null);
  const [properties, setProperties] = useState<DatabaseProperty[]>([]);
  const [rows, setRows] = useState<DatabaseRow[]>([]);
  const [views, setViews] = useState<DatabaseView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (databaseId) {
      fetchDatabase();
      setupRealtimeSubscription();
    }
  }, [databaseId]);

  const fetchDatabase = async () => {
    if (!databaseId) return;

    try {
      setLoading(true);

      // Fetch database info
      const { data: dbData, error: dbError } = await supabase
        .from('databases')
        .select('*')
        .eq('id', databaseId)
        .single();

      if (dbError) throw dbError;
      setDatabase(dbData);

      // Fetch properties
      const { data: propsData, error: propsError } = await supabase
        .from('database_properties')
        .select('*')
        .eq('database_id', databaseId)
        .order('position');

      if (propsError) throw propsError;
      setProperties(propsData || []);

      // Fetch rows
      const { data: rowsData, error: rowsError } = await supabase
        .from('database_rows')
        .select('*')
        .eq('database_id', databaseId)
        .order('position');

      if (rowsError) throw rowsError;
      setRows(rowsData || []);

      // Fetch views
      const { data: viewsData, error: viewsError } = await supabase
        .from('database_views')
        .select('*')
        .eq('database_id', databaseId)
        .order('created_at');

      if (viewsError) throw viewsError;
      setViews(viewsData || []);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!databaseId) return;

    const channel = supabase
      .channel(`database-${databaseId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'database_rows',
          filter: `database_id=eq.${databaseId}`
        },
        () => {
          fetchDatabase();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const addProperty = async (property: Omit<TablesInsert<'database_properties'>, 'database_id'>) => {
    if (!databaseId) return;

    const { error } = await supabase
      .from('database_properties')
      .insert({
        ...property,
        database_id: databaseId,
        position: properties.length
      });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      fetchDatabase();
    }
  };

  const updateProperty = async (id: string, updates: TablesUpdate<'database_properties'>) => {
    const { error } = await supabase
      .from('database_properties')
      .update(updates)
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      fetchDatabase();
    }
  };

  const deleteProperty = async (id: string) => {
    const { error } = await supabase
      .from('database_properties')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      fetchDatabase();
    }
  };

  const addRow = async (rowData?: Record<string, any>) => {
    if (!databaseId) return;

    const { error } = await supabase
      .from('database_rows')
      .insert({
        database_id: databaseId,
        properties: rowData || {},
        position: rows.length
      });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      fetchDatabase();
    }
  };

  const updateRow = async (id: string, properties: Record<string, any>) => {
    const { error } = await supabase
      .from('database_rows')
      .update({ properties })
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      fetchDatabase();
    }
  };

  const deleteRow = async (id: string) => {
    const { error } = await supabase
      .from('database_rows')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      fetchDatabase();
    }
  };

  return {
    database,
    properties,
    rows,
    views,
    loading,
    addProperty,
    updateProperty,
    deleteProperty,
    addRow,
    updateRow,
    deleteRow,
    refetch: fetchDatabase
  };
};
