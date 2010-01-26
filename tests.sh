echo "Public Tests ---"
for file in `find  tests/public -name '*.in'`
do
	echo "Running" $file "... " 
	sh mjava < $file > `echo $file | sed 's/\.in//'`.result
	diff `echo $file | sed 's/\.in//'`.result `echo $file | sed 's/\.in//'`.out
done
echo
echo "Private Tests ---"
for file in `find  tests/private -name '*.in'`
do
	echo "Running" $file "... " 
	sh mjava < $file > `echo $file | sed 's/\.in//'`.result
	diff `echo $file | sed 's/\.in//'`.result `echo $file | sed 's/\.in//'`.out
done