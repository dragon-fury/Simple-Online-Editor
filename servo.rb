require 'sinatra'
require 'haml'
require 'json'

get '/' do
	haml :index, locals: {name: "Online Text Editor", project: 'Public'}
end

get '/project' do
	content_type :json

	data = directory_hash('/user/file/path', 'project_name')
	[data].to_json
end

get %r{/code/(.+)} do

	file_ext = (params[:captures].first)[/[a-z]*$/]
  file_name = '/user/file/path/'+(params[:captures].first)
  file = File.new(file_name, "r")
  content = ""
  while (line = file.gets)
      content += line
  end
  file.close
  content.to_s
end

private

def directory_hash(path, name=nil)
  data = {label: (name || path)}
  data[:children] = children = []
  Dir.foreach(path) do |entry|
    next if (entry == '..' || entry == '.' || entry.start_with?("."))
    full_path = File.join(path, entry)
    if File.directory?(full_path)
      children << directory_hash(full_path, entry)
    else
      children << {label: entry}
    end
  end
  return data
end

# Json for jqTree to render
#
# [
#     {
#         label: 'node1',
#         children: [
#             { label: 'child1' },
#             { label: 'child2' }
#         ]
#     },
#     {
#         label: 'node2',
#         children: [
#             { label: 'child3' }
#         ]
#     }
# ].to_json
