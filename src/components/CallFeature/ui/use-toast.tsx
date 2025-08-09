export const useToast = () => {
  const toast = ({ title, description }) => {
    console.log("Toast:", title, description);
  };
  return { toast };
};