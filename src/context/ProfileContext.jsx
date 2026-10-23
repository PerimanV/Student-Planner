
import { createContext, useContext, useEffect, useState } from "react";

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProfile() {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/profile",
                    {
                        credentials: "include"
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to load profile");
                }

                const data = await response.json();
                setProfile(data);
            } catch (error) {
                console.error("Error loading profile:", error);
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, []);

    // Provide stored profile data and make the VALUE attributes 
    // avaliable to components using the provider
    return (
        <ProfileContext.Provider
            value={{ profile, setProfile, loading }}
        >
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    return useContext(ProfileContext);
}
