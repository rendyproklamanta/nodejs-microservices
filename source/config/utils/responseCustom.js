const responseCustom = (res) => {
   return {
      code: res?.code,
      success: res?.success,
      data: res?.data,
      message: res?.message,
      error: res?.error,
   };
};

export default responseCustom;
