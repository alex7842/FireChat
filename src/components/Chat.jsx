<div className="flex flex-col h-screen">
  {/* Chat Header */}
  
  {/* Messages Container */}
  <div 
    id="msg-container1"
    style={{ backgroundColor: chatBackground }}
    className="flex-1 overflow-auto h-[calc(100vh-120px)]"
  >
    {/* Message content remains same */}
  </div>

  {/* Reply Section */}
  {replyTo && (
    <div className="reply bg-gray-50 px-4 py-2 border-t">
      <div className="flex justify-between items-center">
        <span>Replying to {replyTo.name}</span>
        <span 
          className="text-xl cursor-pointer" 
          onClick={() => setReplyTo(false)}
        >
          ❌
        </span>
      </div>
      <p className="text-gray-600 truncate">{replyTo.text}</p>
    </div>
  )}

  {/* Input Section */}
  <div className="sticky bottom-0 bg-white border-t px-2 py-2">
    <CustomInput
      value={text}
      suffix={suffix}
      onChange={handleChange}
      onSearch={handleSearch}
      suggestion={suggestions}
      onKeyDown={handleKeyDown}
      className="w-full"
    />
  </div>
</div>
