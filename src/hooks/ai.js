import { useState } from 'react';

// AI model
const ai = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchSuggestions = async (query, temp, maxtokens, model, type) => {
    setLoading(true); // Assuming this is part of your component state
    setError(null);
  
    try {
      const options = {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer B6q76Q91K4HyseT1Qm0Mi4uaPQ3GmpmAMNtC6cZOSYTVQKVI"
        },
        body: JSON.stringify({
          model: `accounts/fireworks/models/${model}`,
          max_tokens: maxtokens,
          temperature: temp,
          ...(type === "chat" ? {
            messages: [
              {
                role: "user",
                content: query // Use query directly for chat
              }
            ]
          } : {
            prompt: query,
            top_p: 1,
            top_k: 40,
          
            presence_penalty: 0,
            frequency_penalty: 0,
           
          
          })
        })
      };
  
      const url = type === "chat" 
        ? "https://api.fireworks.ai/inference/v1/chat/completions" 
        : "https://api.fireworks.ai/inference/v1/completions";
  
      const response = await fetch(url, options);
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log("fireworks", data);
  
      // Handle response for chat or completions
      if (type === "chat") {
        setSuggestions(data.choices[0].message.content.split('\n').filter(Boolean)); // Get chat response
      } else {
        setSuggestions(data.choices[0].text.split('\n').filter(Boolean)); // Get completion response
      }
  
    } catch (error) {
      setError('Failed to fetch suggestions');
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };



  // const fetchSuggestions = async (prompt,temp,maxtokens,model) => {
  //   try {
  //     const response = await fetch("https://api.fireworks.ai/inference/v1/completions", {
  //       method: "POST",
  //       headers: {
  //         "Accept": "application/json",
  //         "Content-Type": "application/json",
  //         "Authorization": "Bearer B6q76Q91K4HyseT1Qm0Mi4uaPQ3GmpmAMNtC6cZOSYTVQKVI"
  //       },
  //       body: JSON.stringify({
  //         model: `accounts/fireworks/models/${model}`,
  //         max_tokens:maxtokens,
  //         top_p: 1,
  //         top_k: 40,
  //         presence_penalty: 0,
  //         frequency_penalty: 0,
  //         temperature: temp,
  //         prompt:prompt
  //       })
  //     });
  
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  
  //     const data = await response.json();
  //     console.log("Generated Usernames:", data.choices[0].text.split('\n').filter(Boolean));
  //     setSuggestions(data.choices[0].text.split('\n').filter(Boolean))
  //   } catch (error) {
  //     console.error('Error fetching suggestions:', error);
  //   }
  // };
  
  
  
  

  return { suggestions, loading, error, fetchSuggestions, setSuggestions };
};

export default ai;
