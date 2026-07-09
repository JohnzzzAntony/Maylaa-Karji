export const formatPrice = (amount: number, currency = "AED") => {
  if (currency === "AED") return `Dhs. ${amount.toLocaleString("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
};

export const cn = (...inputs: (string | undefined | null | false)[]) => inputs.filter(Boolean).join(" ");
