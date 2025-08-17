import { useState } from 'react';
import { apiService } from '@/lib/api';
import { useBackendAuth } from './useBackendAuth';
import { useToast } from './use-toast';

interface ContentCreatorProfile {
  contentGenre: 'educational' | 'entertainment' | 'gaming' | 'lifestyle' | 'music' | 'tech' | 'travel' | 'other';
}

interface EntrepreneurProfile {
  businessCategory: 'ecommerce' | 'saas' | 'consulting' | 'agency' | 'retail' | 'manufacturing' | 'other';
  businessDescription: string;
}

interface SocialMediaManagerProfile {
  clientType: 'influencers' | 'small-businesses' | 'corporate' | 'individuals' | 'mixed';
  businessSize: 'solo' | 'small-team' | 'medium' | 'large';
  socialMediaNiche: 'content-creation' | 'community-management' | 'marketing-campaigns' | 'analytics' | 'full-service';
}

export const useBackendProfile = () => {
  const [loading, setLoading] = useState(false);
  const { user, refreshUser } = useBackendAuth();
  const { toast } = useToast();

  const updateUserRole = async (role: 'content-creator' | 'entrepreneur' | 'social-media-manager') => {
    if (!user) return { error: 'No user found' };

    setLoading(true);
    
    try {
      const result = await apiService.updateUserProfile({ userRole: role });

      setLoading(false);

      if (result.error) {
        toast({
          title: "Error updating role",
          description: result.error,
          variant: "destructive",
        });
        return { error: result.error };
      }

      await refreshUser();
      toast({
        title: "Role updated",
        description: "Your role has been updated successfully",
      });
      return { error: null };
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error updating role",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error: 'An unexpected error occurred' };
    }
  };

  const createContentCreatorProfile = async (contentGenre: ContentCreatorProfile['contentGenre']) => {
    if (!user) return { error: 'No user found' };

    setLoading(true);

    try {
      const result = await apiService.updateRoleSpecificProfile({
        role: 'content-creator',
        contentGenre,
      });

      setLoading(false);

      if (result.error) {
        toast({
          title: "Error creating profile",
          description: result.error,
          variant: "destructive",
        });
        return { error: result.error };
      }

      await refreshUser();
      toast({
        title: "Profile created",
        description: "Your content creator profile has been created successfully",
      });
      return { error: null };
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error creating profile",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error: 'An unexpected error occurred' };
    }
  };

  const createEntrepreneurProfile = async (
    businessCategory: EntrepreneurProfile['businessCategory'],
    businessDescription: string
  ) => {
    if (!user) return { error: 'No user found' };

    setLoading(true);

    try {
      const result = await apiService.updateRoleSpecificProfile({
        role: 'entrepreneur',
        businessCategory,
        businessDescription,
      });

      setLoading(false);

      if (result.error) {
        toast({
          title: "Error creating profile",
          description: result.error,
          variant: "destructive",
        });
        return { error: result.error };
      }

      await refreshUser();
      toast({
        title: "Profile created",
        description: "Your entrepreneur profile has been created successfully",
      });
      return { error: null };
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error creating profile",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error: 'An unexpected error occurred' };
    }
  };

  const createSocialMediaManagerProfile = async (
    clientType: SocialMediaManagerProfile['clientType'],
    businessSize: SocialMediaManagerProfile['businessSize'],
    socialMediaNiche: SocialMediaManagerProfile['socialMediaNiche']
  ) => {
    if (!user) return { error: 'No user found' };

    setLoading(true);

    try {
      const result = await apiService.updateRoleSpecificProfile({
        role: 'social-media-manager',
        clientType,
        businessSize,
        socialMediaNiche,
      });

      setLoading(false);

      if (result.error) {
        toast({
          title: "Error creating profile",
          description: result.error,
          variant: "destructive",
        });
        return { error: result.error };
      }

      await refreshUser();
      toast({
        title: "Profile created",
        description: "Your social media manager profile has been created successfully",
      });
      return { error: null };
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error creating profile",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error: 'An unexpected error occurred' };
    }
  };

  const updatePersona = async (personaData: any) => {
    if (!user) return { error: 'No user found' };

    setLoading(true);

    try {
      const result = await apiService.updatePersona(personaData);

      setLoading(false);

      if (result.error) {
        toast({
          title: "Error updating persona",
          description: result.error,
          variant: "destructive",
        });
        return { error: result.error };
      }

      await refreshUser();
      toast({
        title: "Persona updated",
        description: "Your persona has been updated successfully",
      });
      return { error: null };
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error updating persona",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error: 'An unexpected error occurred' };
    }
  };

  const addPastOutput = async (outputData: any) => {
    if (!user) return { error: 'No user found' };

    setLoading(true);

    try {
      const result = await apiService.addPastOutput(outputData);

      setLoading(false);

      if (result.error) {
        toast({
          title: "Error adding past output",
          description: result.error,
          variant: "destructive",
        });
        return { error: result.error };
      }

      await refreshUser();
      toast({
        title: "Past output added",
        description: "Your past output has been added successfully",
      });
      return { error: null };
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error adding past output",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { error: 'An unexpected error occurred' };
    }
  };

  return {
    loading,
    updateUserRole,
    createContentCreatorProfile,
    createEntrepreneurProfile,
    createSocialMediaManagerProfile,
    updatePersona,
    addPastOutput,
  };
};
