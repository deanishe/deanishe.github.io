import Cocoa

struct Pboard: Codable {
	var html: String
	var text: String
}
var pb = Pboard(html: "", text: "")

// get contents of general pasteboard
let typeHtml = NSPasteboard.PasteboardType.html
let typeText = NSPasteboard.PasteboardType.string

if let s = NSPasteboard.general.string(forType:typeHtml) {
	pb.html = s
}
if let s = NSPasteboard.general.string(forType:typeText) {
	pb.text = s
}

// encode to JSON and print
let encoder = JSONEncoder()
let data = try encoder.encode(pb)
let string = String(data: data, encoding: .utf8)!
print(string)
