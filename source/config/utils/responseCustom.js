const responseCustom = (res) => {
   return {
      success: res?.success,
      data: res?.data,
      message: res?.message,
      error: res?.error,
      errorCode: res?.code,
      keyValue: res?.keyValue,
   };
};

export default responseCustom;
